const cp = require('./config/config.pro');
const cd = require('./config/config.dev');
const lcp = require('./config/log.config.pro');
const lcd = require('./config/log.config.dev');

//set system path is dev;
const _sys_ = 'dev';

//ct:(undefind) default value is config
//any value is log
const config = (ct) => {
    if (_sys_) {
        if (ct) {
            return lcd;
        }
        else {
            return cd;
        }
    }
    else {
        if (ct) {
            return lcp;
        }
        else {
            return cp;
        }

    }
};

module.exports = config;