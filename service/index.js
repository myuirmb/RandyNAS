const http = require('http');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const multipart = require('connect-multiparty');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const uuidv4 = require('uuid/v4');

const config = require('./config');
const sqlitehelper = require('./sys_modules/sqlite3-helper');
const fileshelper = require('./sys_modules/files-helper');
const authhelper = require('./sys_modules/auth-helper');

//-----config-------------------------------
const conf = config();

let uploads = {};

//-----log----------------------------------
log4js.configure(config(1));
const logger = log4js.getLogger('index');

//-----sqlite-helper------------------------
const sh = new sqlitehelper();

//-----files-helper-------------------------
const fh = new fileshelper();
const privatekey = fh.readfilesync(conf.vfy.rsa.privatekey);
const publickey = fh.readfilesync(conf.vfy.rsa.publickey);
logger.info('----------init-----key-------------->', privatekey, publickey)

//-----auth-helper--------------------------
const ah = new authhelper();

//-----http-------------------------------------------------------------------------
const app = express();
const server = http.createServer(app);
server.listen(conf.http.port, () => {
    logger.info(`http service is run as port ${conf.http.port}`);
});

const jp = bodyparser.json();
const cp = cookieparser('f8926d84-32c4-41a2-ae3e-d5b81bf9a063');
//const urlp = bodyparser.urlencoded({ extended: false });
const mp = multipart({ uploadDir: conf.upl.temp });


app.disable('x-powered-by');

//main 主页
app.get('/', jp, cp, async (req, res) => {
    // const allfiles = await fh.readdirsync(
    //     sh,
    //     'D:/PMO',
    //     ah.strto(ah.strto(conf.appid)),
    //     '0'
    // );
    // res.setHeader('Content-Type', 'text/plain');
    // res.send(allfiles);
    // res.end();

    // const allfiles = await fh.getfiles(sh, '*.doc');
    // logger.info('------allfiles------->', allfiles);

    // res.setHeader('Content-Type', 'text/plain');
    // res.send(allfiles);

    // const t = await fh.mergefiles(['R-0GMo5Pi6lw477g6XUtqn1M', 'i0gEcdzKT1zIIQqcpB2F4DFx'], uuidv4(), '.zip');
    // logger.info(t);
    res.end('end');
});


app.post('/init', mp, jp, cp, async (req, res) => {
    const { nas, log } = req.signedCookies;
    let resault = null;
    try {
        resault = await ah.init(sh, nas, log, privatekey, publickey);
    }
    catch (e) {
        logger.error('init in error:', e);
    }
    res.setHeader('Content-Type', 'text/plain');
    if (resault.info) {
        if (resault.ck) res.cookie(resault.ck.key, resault.ck.val, resault.ck.attr);
        res.send(`{"code":200,"data":${JSON.stringify(resault.info)},"msg":"ok"}`);
    }
    else {
        res.send(`{"code":200,"data":{"err":"init failing..."},"msg":"ok"}`);
    }
    res.end();
});

app.post('/login', mp, jp, cp, async (req, res) => {
    let resault = null;
    try {
        resault = await ah.login(sh, privatekey, req.body.username, req.body.password, req.body.autologin);
    }
    catch (e) {
        logger.error('login in error:', e);
    }
    res.setHeader('Content-Type', 'text/plain');
    if (resault.info) {
        res.cookie(resault.ck.nas.key, resault.ck.nas.val, resault.ck.nas.attr);
        res.cookie(resault.ck.log.key, resault.ck.log.val, resault.ck.log.attr);
        res.send(`{"code":200,"data":${JSON.stringify(resault.info)},"msg":"ok"}`);
    }
    else {
        res.send(`{"code":200,"data":{"err":"login failing..."},"msg":"ok"}`);
    }
    res.end();
});

app.post('/menu', mp, jp, cp, async (req, res) => {
    let resault = { menu: null }, pid = ah.strto(ah.strto(conf.appid));
    try {
        logger.info(req.body.pid);
        if (req.body.pid) { pid = req.body.pid; }
        else {
            resault.cid = pid;
            resault.rn = conf.appname;
        }
        resault.menu = { [pid]: await fh.getmenu(sh, pid) };
    }
    catch (e) {
        logger.error('menu in error:', e);
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(`{"code":200,"data":${JSON.stringify(resault)},"msg":"ok"}`);
    res.end();
});

app.post('/files', mp, jp, cp, async (req, res) => {
    let allfiles = null;
    try {
        let str = req.body.str ? req.body.str : '';
        allfiles = await fh.getfiles(sh, str);
    }
    catch (e) {
        logger.error('files in error:', e);
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(`{"code":200,"data":${JSON.stringify({ search: allfiles })},"msg":"ok"}`);
    res.end();
});

app.post('/dl', mp, jp, cp, async (req, res) => {
    const id = req.body.id;
    let resault = null;
    try {
        resault = await fh.downloadfile(sh, id);
    }
    catch (e) {
        logger.error('download in error:', e);
    }
    // logger.info('------download---->', id, resault);
    if (resault.rs) {
        res.writeHead(200, {
            // 'Content-Type': 'application/force-download',
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + encodeURI(resault.rows.fname),
            'Content-Length': resault.rows.fsize
        });
        resault.rs.pipe(res);
    }
    else {
        res.end();
    }
});

app.post('/ul', mp, jp, cp, async (req, res) => {
    const pid = req.body.pid,
        id = req.body.id,
        fname = req.body.fname,
        fsize = req.body.fsize,
        ftype = req.body.ftype,
        sp = req.body.sp,
        order = req.body.order,
        files = req.files;
    const sp1 = parseInt(sp), order1 = parseInt(order);

    logger.info(`-----upload----->:pid=${pid},id=${id},fname=${fname},fsize=${fsize},ftype=${ftype},sp=${sp},order=${order}`, files);

    let resault = null;
    if (sp1 === 1) {
        resault = await fh.uploadfile(sh, pid, fname, fsize, [files.files.path]);
    }
    else if (sp1 > 1) {
        if (!uploads[`f_${id}`]) uploads[`f_${id}`] = { sp: sp1, upl: 0, filelist: [] };

        uploads[`f_${id}`].upl += 1;
        uploads[`f_${id}`].filelist[order1] = files.files.path;


        logger.info('---------uploads--info-------->', uploads);

        if (uploads[`f_${id}`].sp === uploads[`f_${id}`].upl) {
            resault = await fh.uploadfile(sh, pid, fname, fsize, uploads[`f_${id}`].filelist);
        }
    }

    logger.info('---------uploads---------->', resault);

    if (resault && resault[pid])
        res.end(`{"code":200,"data":{"menu":${JSON.stringify(resault)}},"msg":"ok"}`);
    else
        res.end(`{"code":200,"data":"${order1}-${sp1}","msg":"files uploading"}`);
});

app.post('/nf', mp, jp, cp, async (req, res) => {
    const pid = req.body.pid, foldername = req.body.fn;
    let resault = null;
    try {
        resault = await fh.newfolder(sh, pid, foldername);
    }
    catch (e) {
        logger.error('new folder in error:', e);
    }
    if (resault[pid])
        res.end(`{"code":200,"data":{"menu":${JSON.stringify(resault)}},"msg":"ok"}`);
    else
        res.end('{"code":501,"msg":"service error"}');
});

app.all('/*', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.send('Nginx 1.1.6');
    res.end();
});