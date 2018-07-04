const cp = require('./config/config.pro');
const cd = require('./config/config.dev');

const lcp = require('./config/log.config.pro');
const lcd = require('./config/log.config.dev');

// import cp from './config/config.pro';
// import cd from './config/config.dev';

// import lcp from './config/log.config.pro';
// import lcd from './config/log.config.dev';

// const config = (ct,sys=1) => {
//     if (sys) {
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

//export const config = (ct, sys = 1) => sys ? (ct ? lcd : cd) : (ct ? lcp : cp);

const config = (ct, sys = 1) => sys ? (ct ? lcd : cd) : (ct ? lcp : cp);
module.exports = config;