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
const mp = multipart();


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
    res.end();
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

app.post('/download', mp, jp, cp, async (req, res) => {
    logger.info(1234);
    const id = req.body.id;
    let resault = null;
    try {
        resault = await fh.downloadfile(sh, id);
    }
    catch (e) {
        logger.error('download in error:', e);
    }
    logger.info('------download---->', id, resault);
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

app.all('/*', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.send('Nginx 1.1.6');
    res.end();
});