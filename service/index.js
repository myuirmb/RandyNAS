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
    let [conn, rows] = [null, null];
    if (!sh.conn) conn = await sh.init();
    row = await ah.verify(sh);
    logger.info(row);
    res.send(row);
    res.end()
});

app.get('/init', jp, cp, async (req, res) => {
    const { nas } = req.signedCookies;
    // const tempid = ah.strto(uuidv4());
    // const initinfo = {
    //     ud: tempid,
    //     un: `guest_${tempid.substr(0, 8)}`,     //user name
    //     ut: 'guest',                            //user type(guest,user,root)
    //     gu: true,                               //guest true:支持匿名登录，false:不支持匿名登录 
    // };
    // let [info, temp, cf] = [{}, {}, -1]

    // if (nas) {
    //     let decoded = null;
    //     try { decoded = await ah.jwtdecode(ah.tostr(nas), publickey); } catch (e) { }
    //     if (decoded) {
    //         if (decoded.ut === 'user') {
    //             if (conf.vfy.auto > 0) {
    //                 let [conn, rows] = [null, null];
    //                 if (!sh.conn) conn = await sh.init();
    //                 rows = await sh.sqlget({
    //                     sql: 'select * from sys_user where id=$id;',
    //                     val: { $id: ah.tostr(decoded.ud) }
    //                 });
    //                 if (rows) Object.assign(temp, { ud: ah.strto(rows.id), un: rows.username, ut: 'user' })
    //                 else cf = 0;
    //             }
    //             else {
    //                 cf = 0;
    //             }
    //         }
    //         else {
    //             Object.assign(temp, decoded);
    //         }
    //     }
    // }
    // else {
    //     cf = 1;
    // }

    // Object.assign(info, initinfo, temp, { gu: conf.vfy.guest });
    // const token = ah.strto(jwt.sign(info, privatekey, { algorithm: 'RS256' }));
    // Object.assign(info, { tk: token });

    // if (cf === 0) res.cookie('nas', '', { maxAge: 0, httpOnly: true, 'signed': true });
    // else if (cf === 1) res.cookie('nas', token, { maxAge: 600000, httpOnly: true, 'signed': true });

    const resault = await ah.verify(sh, nas, privatekey, publickey);
    //logger.info(resault);
    res.setHeader('Content-Type', 'text/plain');
    if(resault.ck)res.cookie('nas', resault.ck.nas, resault.ck.attr);
    res.send(`{"code":200,"data":${JSON.stringify(resault.info)},"msg":"ok"}`);
    res.end();
});

app.post('/login', jp, cp, async (req, res) => {
    logger.info(req.headers, req.body);
    res.send(`{"code":200,"data":{"ud":"a8926d84-32c4-41a2-ae3e-d5b81bf9a063","un":"${req.body.username}","ut":"user","gu":true},"msg":"ok"}`);
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