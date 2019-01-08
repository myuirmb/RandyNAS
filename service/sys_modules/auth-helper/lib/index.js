const path = require('path');
const events = require('events');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const uuidv4 = require('uuid/v4');

const config = require('../../../config');
const sqlitehelper = require('../../sqlite3-helper');
const fileshelper = require('../../files-helper');

class authhelper extends events {
    constructor(request, response) {
        super();
        // this.req = request;
        // this.res = response;
        this.conf = config();
        log4js.configure(config(1));
        this.logger = log4js.getLogger('auth-helper.index');
    }

    init() {

    }

    async verify(sh, nas, privatekey, publickey) {
        const tempid = this.strto(uuidv4());
        const initinfo = {
            ud: tempid,
            un: `guest_${tempid.substr(0, 8)}`,     //user name
            ut: 'guest',                            //user type(guest,user,root)
            gu: true,                               //guest true:支持匿名登录，false:不支持匿名登录 
        };
        let [info, ck, temp, cf] = [{}, null, {}, -1];

        if (nas) {
            let decoded = null;
            try {
                decoded = await this.jwtdecode(this.tostr(nas), publickey);
            }
            catch (e) {
                this.logger.error('class auth helper verify feild error: ', e);
            }
            if (decoded) {
                if (decoded.ut === 'user') {
                    if (this.conf.vfy.auto > 0) {
                        let [conn, rows] = [null, null];
                        if (!sh.conn) conn = await sh.init();
                        rows = await sh.sqlget({
                            sql: 'select * from sys_user where id=$id;',
                            val: { $id: this.tostr(decoded.ud) }
                        });
                        if (rows) Object.assign(temp, { ud: this.strto(rows.id), un: rows.username, ut: 'user' })
                        else cf = 0;
                    }
                    else {
                        cf = 0;
                    }
                }
                else {
                    Object.assign(temp, decoded);
                }
            }
        }
        else {
            cf = 1;
        }

        Object.assign(info, initinfo, temp, { gu: this.conf.vfy.guest });
        const token = this.strto(jwt.sign(info, privatekey, { algorithm: 'RS256' }));
        Object.assign(info, { tk: token });

        // if (cf === 0) res.cookie('nas', '', { maxAge: 0, httpOnly: true, 'signed': true });
        // else if (cf === 1) res.cookie('nas', token, { maxAge: 600000, httpOnly: true, 'signed': true });

        if (cf === 0) ck = { nas: '', attr: { maxAge: 0, httpOnly: true, 'signed': true } };
        else if (cf === 1) ck = { nas: token, attr: { maxAge: 600000, httpOnly: true, 'signed': true } };

        return { info, ck };
    }

    jwtdecode(token, publickey) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, publickey, (err, decoded) => {
                if (err) {
                    this.logger.error('class auth helper jwtdecode jwt.verify feild error: ', err);
                    reject(null);
                }
                else {
                    this.logger.info('class auth helper jwtdecode jwt.verify feild okey:', decoded);
                    resolve(decoded);
                }
            });
        });
    }

    tostr(data) {
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
        this.logger.info(`${data} ==tostr==> ${redata}`);
        return redata;
    }

    strto(data = '') {
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
        this.logger.info(`${data} ==strto==> ${redata}`);
        return redata;
    }

}

module.exports = authhelper;