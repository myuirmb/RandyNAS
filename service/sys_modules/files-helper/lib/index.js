const events = require('events');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const uuidv4 = require('uuid/v4');
const config = require('../../../config');

class fileshelper extends events {
    constructor() {
        super();

        //let conf = config();
        log4js.configure(config(1));
        this.logger = log4js.getLogger('files-helper.index');
    }

    init() {

    }

    traverse(fpath) {
        fs.readdir(fpath, (err, files) => {
            if (err) {
                console.log(err);
                this.logger.error(`class method traverse fs.readdir is error: ${err}`);
            }
            else {
                for (let i = 0, len = files.length; i < len; i++) {
                    let file = path.join(fpath, files[i]);
                    fs.stat(file, (error, stats) => {
                        if (error) {
                            this.logger.error(`class method traverse fs.stat is error: ${error}`);
                        }
                        else {
                            let [isfile, isdir] = [stats.isFile(), stats.isDirectory()];
                            this.emit('fileinfo', { fpath, file, isfile, isdir });
                            this.logger.info(`file.info: ${JSON.stringify({ fpath, file, isfile, isdir, stats })}`);
                            if (isdir) this.traverse(file);
                        }
                    });
                }
            }
        });
    }

    async readdirsync(sh, fpath, fid, pcode) {
        
        let files = null;
        try { files = fs.readdirSync(fpath); }
        catch (err) { this.logger.error(`class method readdirsync fs.readdirSync is error: ${fpath} => ${err} `); }
        if (files && files.length) {
            let list = [];
            for (let i = 0, len = files.length; i < len; i++) {
                const file = path.join(fpath, files[i]);
                const stats = fs.statSync(file);
                const id=uuidv4(),pathcode=`${pcode}-${i.toString(16)}`;
                list.push({
                    $id: id,
                    $fid: fid,
                    $pathcode: pathcode,
                    $fpath: file,
                    $fname: files[i],
                    $fext: path.extname(files[i]),
                    $fsize: stats.size,
                    $ftype:(stats.isDirectory()?'folder':path.extname(files[i])),
                    $ftime:stats.birthtime,
                    $stime:new Date().getTime()
                });
                if (stats.isDirectory()) this.readdirsync(sh,file,id,pathcode);
            }
            //this.logger.info('class method readdirsync fs.readdirSync path =>',list);
            let shinit=null;
            if (!sh.conn) shinit=await sh.init();
            const rows=await sh.sqlexec({
                sql: 'insert into sys_list(id,fid,pathcode,fpath,fname,fext,fsize,ftype,ftime,stime) values($id,$fid,$pathcode,$fpath,$fname,$fext,$fsize,$ftype,$ftime,$stime);',
                val:list
            });
            this.logger.info('class method readdirsync fs.readdirSync path =>',list,rows);
        }
    }

    readfilesync(fpath) {
        let fc = null;
        try {
            fc = fs.readFileSync(fpath);
        }
        catch (err) {
            this.logger.error(`class method readfilesync fs.readFileSync is error: ${fpath} => ${err} `);
        }
        return fc;
    }

    readfilep(fpath) {
        return new Promise((resolve, reject) => {
            fs.readFile(fpath, (err, data) => {
                if (err) {
                    this.logger.error(`class method readfilep(Promise) fs.readFile is error: ${fpath} => ${err} `);
                    reject(err);
                }
                else {
                    this.logger.info(`class method readfilep(Promise) fs.readFile is okey: ${fpath}`);
                    resolve(data);
                }
            });
        });
    }

    async getmenu(sh,fid){
        let conn=null,rows=null;
        if(!sh.conn)conn=await sh.init();
        rows=await sh.sqlall({
            sql: 'select id,fid,fname,ftype from sys_list where fid=$fid order by ftype desc,fname asc;',
            val: { $fid:fid }
        });
        return rows;
    }

    readdirp(fpath) {
        return new Promise((resolve, reject) => {
            fs.readdir(fpath, (err, files) => {
                if (err) {
                    //this.logger.error(`class method readdirp fs.readdir is error: ${err}`);
                    //reject(err);
                }
                else {
                    this.logger.info(`class method readdirp fs.readdir is : ${JSON.stringify(files)}`);
                    resolve(files);
                }
            });
        });
    }

    statp(file) {
        return new Promise((resolve, reject) => {
            fs.stat(file, (err, stats) => {
                if (err) {
                    this.logger.error(`class method statp fs.stat is error: ${err}`);
                    reject(err);
                }
                else {
                    this.logger.info(`class method statp fs.stat is : ${JSON.stringify(stats)}`);
                    resolve(stats);
                }
            });
        });
    }

    getdir(fpath) {
        return this.statp(fpath).then(stats => {
            if (stats.isDirectory()) {
                return this.readdirp(fpath).then(
                    files => Promise.all(
                        files.map(
                            file => this.readdirp(path.resolve(fpath, file))
                        )
                    )
                ).then(list => [].concat(...list));
            }
            else {
                return fpath;
            }
        });
    }

}

module.exports = fileshelper;