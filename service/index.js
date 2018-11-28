const http = require('http');
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

//-----config-----------------------------------------------------------------------
const conf = config();
const logconf = config(1);


//-----log--------------------------------------------------------------------------
log4js.configure(logconf);
const logger = log4js.getLogger('index');

//-----sqlite-helper----------------------------------------------------------------
const sh = new sqlitehelper();

//-----files-helper-----------------------------------------------------------------
const fh = new fileshelper();
fh.init();

//-----auth-helper------------------------------------------------------------------
const ah = new authhelper();
ah.init();

//let a=ah.strto('29dcc655-bedb-4d58-bfc5-fa4a7f42eb1a');
let a = ah.strto('2424ashfklasdu93239fksadfj;lom,sa0312#*!^#*');
let b = ah.tostr(a);


//-----http-------------------------------------------------------------------------
const app = express();
const server = http.createServer(app);
server.listen(conf.http.port, () => {
    logger.info(`http service is run as port ${conf.http.port}`);
});

const jp = bodyparser.json();
const cp = cookieparser();
//const urlp = bodyparser.urlencoded({ extended: false });

app.get('/login', jp, cp, async (req, res) => {
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
    res.setHeader('Content-Type', 'text/plain');
    //res.setHeader('Authorization',`Bearer ${token}`)
    //res.send(`${conn} --> ${JSON.stringify(rows)}`);
    res.send(`{"data":"hello world","token":"${token}"}`);
    res.end();

});

app.get('/', jp, cp, async (req, res) => {

    logger.info(req.url, req.headers);

    // let [conn, rows] = [null, null];
    // if (!sh.conn) conn = await sh.init();
    // rows = await sh.sqlall({
    //     sql: 'select * from sys_user where id<>$id;',
    //     val: { $id: 'd56e6371-a2fa-4533-9584-ac3840530ce9' }
    // });

    // sh.test();

    //fh.traverse('D:\\Randy\\nase\\randynas\\service\\');
    //fh.traverse('D:\\Randy\\nase\\MongoDB\\');
    //let lists= fh.getdir('D:\\Randy\\nase\\MongoDB\\');

    // let textx=jwt.sign({test:'hello jwt'},'good bye', (err,token)=>{
    //     logger.info(token,'--');
    // });

    // let textx=jwt.sign({ foo: 'bar' }, 'shhhhh');
    // logger.info(textx);
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

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Authorization', `Bearer ${token}`)
    //res.send(`${conn} --> ${JSON.stringify(rows)}`);
    res.send(`{"data":"hello world","token":"${token}"}`);
    res.end();

});