const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const config=require('./config')();

const app = express();
const server = http.createServer(app);
server.listen(config.http.port, () => {
    console.log('http service is run as port 13579');
});

const jp = bodyparser.json();
const cp = cookieparser();
//const urlp = bodyparser.urlencoded({ extended: false });


app.get('/', jp, cp, (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('hello world');
    res.end();
});
