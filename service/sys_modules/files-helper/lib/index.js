const events = require('events');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const uuidv4 = require('uuid/v4');
const config = require('../../../config');

class fileshelper extends events {
    constructor() {
        super();

        this.conf = config();
        log4js.configure(config(1));
        this.logger = log4js.getLogger('files-helper.index');
    }

    init() {

    }

    readDir(fpath) {
        fs.readdir(fpath, (err, files) => {
            if (err) {
                console.log(err);
                this.logger.error(`class method readDir fs.readdir is error: ${err}`);
            }
            else {
                for (let i = 0, len = files.length; i < len; i++) {
                    let file = path.join(fpath, files[i]);
                    fs.stat(file, (error, stats) => {
                        if (error) {
                            this.logger.error(`class method readDir fs.stat is error: ${error}`);
                        }
                        else {
                            let [isfile, isdir] = [stats.isFile(), stats.isDirectory()];
                            this.emit('fileinfo', { fpath, file, isfile, isdir });
                            this.logger.info(`file.info: ${JSON.stringify({ fpath, file, isfile, isdir, stats })}`);
                            if (isdir) this.readDir(file);
                        }
                    });
                }
            }
        });
    }

    readFileSync(fpath) {
        let fc = null;
        try {
            fc = fs.readFileSync(fpath);
        }
        catch (err) {
            this.logger.error(`class method readFileSync fs.readFileSync is error: ${fpath} => ${err} `);
        }
        return fc;
    }

    readFileAsPromise(fpath) {
        return new Promise((resolve, reject) => {
            fs.readFile(fpath, (err, data) => {
                if (err) {
                    this.logger.error(`class method readFileAsPromise(Promise) fs.readFile is error: ${fpath} => ${err} `);
                    reject(err);
                }
                else {
                    this.logger.info(`class method readFileAsPromise(Promise) fs.readFile is okey: ${fpath}`);
                    resolve(data);
                }
            });
        });
    }

    async readDirSync(sh, fpath, fid, pcode) {
        let files = null;
        try { files = fs.readdirSync(fpath); }
        catch (err) { this.logger.error(`class method readDirSync fs.readdirSync is error: ${fpath} => ${err} `); }
        if (files && files.length) {
            let list = [];
            for (let i = 0, len = files.length; i < len; i++) {
                const file = path.join(fpath, files[i]);
                const stats = fs.statSync(file);
                const id = uuidv4(), pathcode = `${pcode}-${i.toString(16)}`;
                list.push({
                    $id: id,
                    $fid: fid,
                    $pathcode: pathcode,
                    $fpath: file,
                    $fname: files[i],
                    $fext: path.extname(files[i]),
                    $fsize: stats.size,
                    $ftype: (stats.isDirectory() ? 'folder' : path.extname(files[i])),
                    $ftime: stats.birthtime,
                    $stime: new Date().getTime()
                });
                if (stats.isDirectory()) this.readDirSync(sh, file, id, pathcode);
            }
            //this.logger.info('class method readDirSync fs.readdirSync path =>',list);
            let shinit = null;
            if (!sh.conn) shinit = await sh.init();
            const rows = await sh.sqlexec({
                sql: 'insert into sys_list(id,fid,pathcode,fpath,fname,fext,fsize,ftype,ftime,stime) values($id,$fid,$pathcode,$fpath,$fname,$fext,$fsize,$ftype,$ftime,$stime);',
                val: list
            });
            this.logger.info('class method readDirSync fs.readdirSync path =>', list, rows);
        }
    }

    async getMenu(sh, fid) {
        let conn = null, rows = null;
        if (!sh.conn) conn = await sh.init();
        rows = await sh.sqlall({
            sql: 'select id,fid,fname,ftype,fsize,stime from sys_list where fid=$fid order by ftype desc,fname asc;',
            val: { $fid: fid }
        });
        return rows;
    }

    async getFiles(sh, str) {
        const sel = str.replace('，', ',').replace('。', '.').split(',');
        let rows = null;
        if (sel.length > 0) {
            let ws = '', val = {};
            for (let i = 0, len = sel.length; i < len; i++) {
                if (sel[i].trim() === '') continue;
                ws += `${i > 0 ? ' or ' : ''} fname like $fname${i}`;
                val[`$fname${i}`] = `%${sel[i].trim().replace('*', '%')}%`;
            }
            this.logger.info(ws, val);
            if (ws !== '') {
                let conn = null;
                if (!sh.conn) conn = await sh.init();
                rows = await sh.sqlall({
                    sql: `select id,fid,fname,ftype,fsize,stime from sys_list where ${ws} order by ftype desc,fname asc;`,
                    val
                });
            }
        }
        return rows;
    }

    async downloadFile(sh, id) {
        let conn = null, rows = null, rs = null;
        if (!sh.conn) conn = await sh.init();
        rows = await sh.sqlget({
            sql: `select id,fpath,fname,ftype,fsize from sys_list where id=$id`,
            val: { $id: id }
        });
        // this.logger.info('------download---file-->', id, rows);
        if (rows && rows.ftype !== 'folder') {
            if (fs.existsSync(rows.fpath)) {
                rs = fs.createReadStream(rows.fpath);
            }
        }
        return { rows, rs };
    }

    async newFolder(sh, pid, foldername) {
        let conn = null, rows = null;
        if (!sh.conn) conn = await sh.init();
        rows = await sh.sqlall({
            sql: `select id,pathcode from sys_list where id=$fid
            union all
            select * from (select id,pathcode from sys_list where fid=$fid order by stime desc limit 1)
            order by pathcode asc;`,
            val: { $fid: pid }
        });
        let fpc = '0', order = 0;
        switch (rows.length) {
            // case 0:
            //     fpc='0';
            //     order=0;
            //     break;
            case 1:
                if (rows[0].id === pid) {   //child node is null
                    fpc = rows[0].pathcode;
                    order = 0;
                }
                else {   //one level node
                    fpc = '0';
                    const pc = rows[0].pathcode.split('-');
                    //this.logger.debug('-------order---->',pc[pc.length - 1],global.parseInt(pc[pc.length - 1], 16));
                    if (pc.length > 1) order = global.parseInt(pc[pc.length - 1], 16) + 1;
                }
                break;
            case 2:
                if (rows[0].id === pid) {   //line 0 is parent node
                    fpc = rows[0].pathcode;
                    const pc = rows[1].pathcode.split('-');
                    if (pc.length > 1) order = global.parseInt(pc[pc.length - 1], 16) + 1;
                }
                else {   //line 1 is parent node
                    fpc = rows[1].pathcode;
                    const pc = rows[0].pathcode.split('-');
                    if (pc.length > 1) order = global.parseInt(pc[pc.length - 1], 16) + 1;
                }
                break;
            default:
                break;
        }

        const newid = uuidv4(), stime = new Date().getTime();
        const irows = await sh.sqlexec({
            sql: 'insert into sys_list(id,fid,pathcode,fpath,fname,fext,fsize,ftype,ftime,stime) values($id,$fid,$pathcode,$fpath,$fname,$fext,$fsize,$ftype,$ftime,$stime);',
            val: [{
                $id: newid,
                $fid: pid,
                $pathcode: `${fpc}-${order.toString(16)}`,
                $fpath: '0',
                $fname: foldername,
                $fext: '',
                $fsize: 0,
                $ftype: 'folder',
                $ftime: stime,
                $stime: stime
            }]
        });

        if (irows.res > 0)
            return { [pid]: [{ id: newid, fid: pid, fname: foldername, ftype: 'folder', fsize: 0, stime }] };
        else
            return irows;
    }

    async uploadFile(sh, pid, fname, fsize, filelist) {
        const newid = uuidv4(), ext = path.extname(fname), stime = new Date().getTime();
        const mf = await this.mergeFiles(filelist, newid, ext);
        this.logger.info('--------upload--file--------->', mf);

        let conn = null, rows = null;
        if (!sh.conn) conn = await sh.init();
        rows = await sh.sqlall({
            sql: `select id,pathcode from sys_list where id=$fid
            union all
            select * from (select id,pathcode from sys_list where fid=$fid order by stime desc limit 1)
            order by pathcode asc;`,
            val: { $fid: pid }
        });
        let fpc = '0', order = 0;
        switch (rows.length) {
            // case 0:
            //     fpc='0';
            //     order=0;
            //     break;
            case 1:
                if (rows[0].id === pid) {   //child node is null
                    fpc = rows[0].pathcode;
                    order = 0;
                }
                else {   //one level node
                    fpc = '0';
                    const pc = rows[0].pathcode.split('-');
                    //this.logger.debug('-------order---->',pc[pc.length - 1],global.parseInt(pc[pc.length - 1], 16));
                    if (pc.length > 1) order = global.parseInt(pc[pc.length - 1], 16) + 1;
                }
                break;
            case 2:
                if (rows[0].id === pid) {   //line 0 is parent node
                    fpc = rows[0].pathcode;
                    const pc = rows[1].pathcode.split('-');
                    if (pc.length > 1) order = global.parseInt(pc[pc.length - 1], 16) + 1;
                }
                else {   //line 1 is parent node
                    fpc = rows[1].pathcode;
                    const pc = rows[0].pathcode.split('-');
                    if (pc.length > 1) order = global.parseInt(pc[pc.length - 1], 16) + 1;
                }
                break;
            default:
                break;
        }

        const irows = await sh.sqlexec({
            sql: 'insert into sys_list(id,fid,pathcode,fpath,fname,fext,fsize,ftype,ftime,stime) values($id,$fid,$pathcode,$fpath,$fname,$fext,$fsize,$ftype,$ftime,$stime);',
            val: [{
                $id: newid,
                $fid: pid,
                $pathcode: `${fpc}-${order.toString(16)}`,
                $fpath: mf.fname,
                $fname: fname,
                $fext: ext,
                $fsize: fsize,
                $ftype: ext,
                $ftime: stime,
                $stime: stime
            }]
        });

        if (irows.res > 0)
            return { [pid]: [{ id: newid, fid: pid, fname, ftype: ext, fsize, stime }] };
        else
            return irows;
    }

    async mergeFiles(filelist, id, ext) {
        const date = new Date();
        const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        const dir = path.join(
            this.conf.upl.dir,
            `y_${y}`,
            `m_${(m + 1).toString().padStart(2, '0')}`,
            `d_${d.toString().padStart(2, '0')}`
        );
        const fname = path.join(dir, `${id}${ext}`);

        const status = await this.dirExists(dir);
        const ws = fs.createWriteStream(fname);
        ws.addListener('error', () => {
            this.logger.info('---------createWriteStream------------->error');
            // return {ret:false,fname};
        });
        // ws.addListener('drain', () => {
        //     this.logger.info('---------createWriteStream------------->drain');
        // });
        // ws.addListener('close', () => {
        //     this.logger.info('---------createWriteStream------------->close');
        //     // return {ret:true,fname};
        // });

        for (let i = 0; i < filelist.length; i++) {
            this.logger.info(`---------writestream------------->await_${i}`);
            const flag = await this.writeStream(filelist[i], ws, (i === filelist.length - 1));
        }
        this.logger.info(`${filelist.join('-->')} ==> ${fname}`);

        return { fname };
    }


    writeStream(spname, ws, end) {
        return new Promise((resolve, reject) => {
            // const rs = fs.createReadStream(path.join(this.conf.upl.temp, spname));
            const rs = fs.createReadStream(spname);
            rs.addListener('end', () => {
                // this.logger.info(`---------createReadStream----${spname}--------->end`);
                resolve(true)
            });
            rs.pipe(ws, { end });
        });
    }



    getStat(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(stats);
                }
            })
        })
    }


    mkdir(dir) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    async dirExists(dir) {
        let isExists = await this.getStat(dir);
        //如果该路径且不是文件，返回true
        if (isExists && isExists.isDirectory()) {
            return true;
        } else if (isExists) {     //如果该路径存在但是文件，返回false
            return false;
        }
        //如果该路径不存在
        let tempDir = path.parse(dir).dir;      //拿到上级路径
        //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
        let status = await this.dirExists(tempDir);
        let mkdirStatus;
        if (status) {
            mkdirStatus = await this.mkdir(dir);
        }
        return mkdirStatus;
    }

}

module.exports = fileshelper;