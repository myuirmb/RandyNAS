const http = require('http');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
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




//main 主页
app.get('/main', jp, cp, async (req, res) => {
    let conn = null, row = null;
    if (!sh.conn) conn = await sh.init();
    row = await ah.login(sh, 'chk9', '123', privatekey);
    logger.info(row);
    res.send(row);
    res.end()
});

app.get('/init', jp, cp, async (req, res) => {
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

app.post('/login', jp, cp, async (req, res) => {
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

app.get('/', jp, cp, async (req, res) => {

    logger.info(req.url, req.headers);

    let [conn, rows] = [null, null];
    if (!sh.conn) conn = await sh.init();
    rows = await sh.sqlall({
        sql: 'select * from sys_user where id<>$id;',
        val: { $id: 'd56e6371-a2fa-4533-9584-ac3840530ce9' }
    });

    // sh.test();

    //fh.traverse('D:\\Randy\\nase\\randynas\\service\\');
    //fh.traverse('D:\\Randy\\nase\\MongoDB\\');
    //let lists= fh.getdir('D:\\Randy\\nase\\MongoDB\\');

    // let textx=jwt.sign({test:'hello jwt'},'good bye', (err,token)=>{
    //     logger.info(token,'--');
    // });

    // let textx=jwt.sign({ foo: 'bar' }, 'shhhhh');
    // logger.info(textx);
    logger.info('----start---->');
    const payload = {
        uid: 'e605994b-9989-4f4a-901d-00cdf3adfec7',
        test: '1',
        ain: 'dafa'
    };

    const privatekey = await fh.readfilep('./config/private.key');
    const publickey = await fh.readfilep('./config/public.key');
    const token = jwt.sign(payload, privatekey, { algorithm: 'RS256' });

    logger.info(privatekey, token);

    jwt.verify(token, publickey, (err, decoded) => {
        if (err) {
            logger.error(`verify feild error: ${err}`);
        }
        else {
            logger.info(decoded);
        }
    });

    logger.info('----end---->');

    res.setHeader('Content-Type', 'text/plain');
    //res.setHeader('Authorization', `Bearer ${token}`)
    res.send(`${conn} --> ${JSON.stringify(rows)}`);
    //res.send(`{"data":"hello world","token":"${token}"}`);
    res.end();

});