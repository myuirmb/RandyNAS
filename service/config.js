const cp = require('./config/config.pro');
const cd = require('./config/config.dev');
const lcp = require('./config/log.config.pro');
const lcd = require('./config/log.config.dev');

//set system path is dev;
const _sys_ = 'dev';

// const config = (ct) => {
//     if (_sys_) {
//         if (ct) {
//             return lcd;
//         }
//         else {
//             return cd;
//         }
//     }
//     else {
//         if (ct) {
//             return lcp;
//         }
//         else {
//             return cp;
//         }

//     }
// };

const config = (ct) => _sys_ ? (ct ? lcd : cd) : (ct ? lcp : cp);

module.exports = config;