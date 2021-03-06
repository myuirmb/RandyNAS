const path = require('path');
const events = require('events');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const uuidv4 = require('uuid/v4');

const config = require('../../../config');

class authHelper extends events {
    constructor() {
        super();
        this.conf = config();
        log4js.configure(config(1));
        this.logger = log4js.getLogger('auth-helper.index');
        // this.logger.info(crypto.getCiphers());
    }

    async init(sh, nas, log, privatekey, publickey) {
        const tempid = this.strTo(uuidv4());
        const initinfo = {
            ud: tempid,
            un: `guest_${tempid.substr(0, 8)}`,     //user name
            ut: 'guest',                            //user type(guest,user,root)
            gu: true,                               //guest true:false
            au: Math.ceil(this.conf.vfy.auto / (24 * 60 * 60 * 1000))
        };
        let info = {}, ck = null, temp = {}, cf = '';

        if (nas) {
            let decoded = null;
            try { decoded = await this.jwtDecode(this.toStr(nas), publickey); }
            catch (e) { this.logger.error('class auth helper verify feild error: ', e); }
            // this.logger.info('------auth--init--nas------>',decoded,this.toStr(decoded.ud));
            if (decoded) {
                if (decoded.ut === 'user') {
                    if (this.conf.vfy.auto > 0 || log) {
                        let [conn, rows] = [null, null];
                        if (!sh.conn) conn = await sh.init();
                        rows = await sh.sqlget({
                            sql: 'select * from sys_user where id=$id;',
                            val: { $id: this.toStr(decoded.ud) }
                        });
                        if (rows) Object.assign(temp, { ud: this.strTo(rows.id), un: rows.username, ut: 'user' });
                        else cf = 'nas_clear';
                    }
                    else {
                        cf = 'nas_clear';
                    }
                }
                else {
                    Object.assign(temp, decoded);
                }
            }
        }
        else {
            cf = 'nas_guest';
        }

        Object.assign(info, initinfo, temp, { gu: this.conf.vfy.guest });
        const token = this.strTo(jwt.sign(info, privatekey, { algorithm: 'RS256' }));
        Object.assign(info, { tk: token });

        if (cf === 'nas_clear') ck = { key: 'nas', val: '', attr: { maxAge: 0, httpOnly: true, 'signed': true } };
        else if (cf === 'nas_guest') ck = { key: 'nas', val: token, attr: { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true, 'signed': true } };
        return { info, ck };
    }

    async login(sh, privatekey, username, password, autologin = false) {
        let conn = null, row = null, info = null, ck = null;
        if (username.trim() === '' || username.trim() === '') {
            this.logger.error(`class auth helper login feild error:username>${username},password>${password}`);
            return { info, ck };
        }

        if (!sh.conn) conn = await sh.init();
        row = await sh.sqlget({
            sql: 'select * from sys_user where username=$username',
            val: { $username: username }
        });

        if (row) {
            if (this.toSha1(password, row.id) === row.password) {
                const userinfo = {
                    ud: this.strTo(row.id),
                    un: username,                           //user name
                    ut: 'user',                             //user type(guest,user,root)
                    gu: this.conf.vfy.guest                 //guest true:支持匿名登录，false:不支持匿名登录 
                };
                const token = this.strTo(jwt.sign(userinfo, privatekey, { algorithm: 'RS256' }));
                Object.assign(info = {}, userinfo, { tk: token });

                ck = {
                    nas: { key: 'nas', val: token, attr: { httpOnly: true, 'signed': true } },
                    log: { key: 'log', val: uuidv4(), attr: { httpOnly: true, 'signed': true } }
                };
                if (this.conf.vfy.auto > 0 && autologin) ck.nas.attr.maxAge = this.conf.vfy.auto;
            }
        }
        return { info, ck };
    }


    jwtDecode(token, publickey) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, publickey, (err, decoded) => {
                if (err) {
                    this.logger.error('class auth helper jwtDecode jwt.verify feild error: ', err);
                    reject(null);
                }
                else {
                    this.logger.info('class auth helper jwtDecode jwt.verify feild okey:', decoded);
                    resolve(decoded);
                }
            });
        });
    }

    toMd5(data, salt = '') {
        const md5 = crypto.createHash('md5');
        this.logger.info(`${this.conf.appid}@${this.strTo(this.conf.seq.a)}_${this.strTo(salt)}:${data}`);
        return md5.update(`${this.conf.appid}@${this.strTo(this.conf.seq.a)}_${this.strTo(salt)}:${data}`).digest('hex');
    }

    toSha1(data, salt = '') {
        const sha1 = crypto.createHash('sha1');
        return sha1.update(`${this.conf.appid}@${this.strTo(this.conf.seq.a)}_${this.strTo(salt)}:${data}`).digest('hex');
    }

    toSha512(data, salt = '') {
        const sha512 = crypto.createHash('sha512');
        return sha512.update(`${this.conf.appid}@${this.strTo(this.conf.seq.a)}_${this.strTo(salt)}:${data}`).digest('hex');
    }

    toStr(data) {
        let redata = '';
        const seqn = config().seq.n;
        if (data && typeof data === 'string') {
            for (let i = 0, len = data.length; i < len; i++) {
                let f = false;
                for (let j = 0, slen = seqn.length; j < slen; j++) {
                    if (data[i] === seqn[j]) {
                        redata += j.toString(16);
                        f = true;
                        break;
                    }
                }
                if (!f) redata += data[i];
            }
        }
        else {
            redata = data;
        }
        // this.logger.info(`${data} ==toStr==> ${redata}`);
        return redata;
    }

    strTo(data = '') {
        let redata = '';
        const seqn = config().seq.n;
        if (data && typeof data === 'string') {
            for (let i = 0, len = data.length; i < len; i++) {
                if (/[a-f\d]/.test(data[i]) && parseInt(data[i], 16) > -1) redata += seqn[parseInt(data[i], 16)]
                else redata += data[i];
            }
        }
        else {
            redata = data;
        }
        // this.logger.info(`${data} ==strTo==> ${redata}`);
        return redata;
    }

}

module.exports = authHelper;