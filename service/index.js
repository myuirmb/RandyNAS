const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const log4js = require('log4js');
const config = require('./config');
const sqlitehelper = require('./sys_modules/sqlite3-helper');
const fileshelper=require('./sys_modules/files-helper');
const uuidv4 = require('uuid/v4');

//-----config-----------------------------------------------------------------------
const conf = config();
const logconf = config(1);


//-----log--------------------------------------------------------------------------
log4js.configure(logconf);
const logger = log4js.getLogger('index');

//-----sqlite-helper----------------------------------------------------------------
const sh = new sqlitehelper();
const fh=new fileshelper();
fh.init();


//-----http-------------------------------------------------------------------------
const app = express();
const server = http.createServer(app);
server.listen(conf.http.port, () => {
    logger.info(`http service is run as port ${conf.http.port}`);
});

const jp = bodyparser.json();
const cp = cookieparser();
//const urlp = bodyparser.urlencoded({ extended: false });


app.get('/', jp, cp, async (req, res) => {

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

    res.setHeader('Content-Type', 'text/plain');
    //res.send(`${conn} --> ${JSON.stringify(rows)}`);
    res.send('{"data":"hello world"}');
    res.end();

});