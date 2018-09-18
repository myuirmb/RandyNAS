const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const log4js = require('log4js');
const config = require('./config');
const sqlitehelper = require('./sys_modules/sqlite3-helper');
const uuidv4 = require('uuid/v4');

// import http from 'http';
// import express from 'express';
// import bodyparser from 'body-parser';
// import cookieparser from 'cookie-parser';
// import log4js from 'log4js';
// import config from './config';


//-----config-----------------------------------------------------------------------
const conf = config();
const logconf = config(1);


//-----log--------------------------------------------------------------------------
log4js.configure(logconf);
const logger = log4js.getLogger('index');

//-----sqlite-helper----------------------------------------------------------------
// const sh = new sqlitehelper();
// sh.on('sqliteres', (res, flag) => {
//     let resstr = '';
//     try { resstr = JSON.stringify(res); }
//     catch (e) { resstr = res; }
//     logger.info(`sqliteres.${flag}`, resstr);
// });
// sh.init();
// sh.test();

// sh.sqlexec({
//     sql: 'insert into sys_action(id,acode,aname,atype) values($id,$acode,$aname,$atype);',
//     val: [
//         { $id: 'test', $acode: 'view', $aname: 'view', $atype: 'all' },
//         { $id: uuidv4(), $acode: 'edit', $aname: 'edit', $atype: 'all' }
//     ]
// }, 'insert-sys_action');

// sh.sqlexec({
//     sql: 'update sys_action set id=$nid where id=$id',
//     val: [{ $nid: uuidv4(), $id: 'test' }]
// }, 'update-sys_action');

// sh.sqlexec({
//     sql: 'insert into sys_action(id,acode,aname,atype) values($id,$acode,$aname,$atype);',
//     val: [
//         { $id: 'test', $acode: 'view', $aname: 'view', $atype: 'all' },
//         { $id: 'test', $acode: 'edit', $aname: 'edit', $atype: 'all' }
//     ]
// }, 'insert-sys_action');

// sh.sqlget({
//     sql:'select * from sys_action where id=$id;',
//     val:{$id:'ba5b3f3a-7673-4a38-92ef-b91785fe5093'}

// },'select.get-sys_action');

// sh.sqlall({
//     sql:'select * from sys_action where id<>$id;',
//     val:{$id:'d56e6371-a2fa-4533-9584-ac3840530ce9'}

// },'select.all-sys_action');

//sh.close();

//-----http-------------------------------------------------------------------------
const app = express();
const server = http.createServer(app);
server.listen(conf.http.port, () => {
    logger.info(`http service is run as port ${conf.http.port}`);
});

const jp = bodyparser.json();
const cp = cookieparser();
//const urlp = bodyparser.urlencoded({ extended: false });


app.get('/', jp, cp, (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('hello world...');
    res.end();
    
    

    // const sh = new sqlitehelper();
    // sh.init();

    // sh.on('sqliteres', (res, flag) => {
    //     let resstr = '';
    //     try { resstr = JSON.stringify(res); }
    //     catch (e) { resstr = res; }
    //     logger.info(`sqliteres.${flag}`, resstr);

    //     resp.setHeader('Content-Type', 'text/plain');
    //     resp.send(`hello world...sqliteres.${flag}: ${resstr}`);
    //     resp.end();

    //     //sh.close();
    // });

    // sh.sqlall({
    //     sql:'select * from sys_action where id<>$id;',
    //     val:{$id:'d56e6371-a2fa-4533-9584-ac3840530ce9'}
    // }, 'select.all-sys_action');

    
});