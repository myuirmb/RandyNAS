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

    verify(token, pubkey, prikey) {
        const tempid = this.strto(uuidv4());
        //const decoded=await this.jwtvfy(token,pubkey);
        let tk;
        if (decoded) {
            if (decoded.ut === 'user') {


            }
            else {
                tk = {};
                Object.assign(tk, decoded, { iat: Date.now(), gu: this.conf.vfy.guest });
            }

        }
        else {
            tk = {
                ud: tempid,
                un: `g_${tempid}`,
                ut: 'guest',
                gu: this.conf.vfy.guest
            };
        }

        return tk;
    }

    jwtdecode(token, publickey) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, publickey, (err, decoded) => {
                if (err) {
                    this.logger.error(`class auth helper verify feild error: ${err}`);
                    reject(null);
                }
                else {
                    this.logger.info(`class auth helper verify feild okey: ${decoded}`);
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
                if (parseInt(data[i], 16) > -1) redata += seqn[parseInt(data[i], 16)]
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