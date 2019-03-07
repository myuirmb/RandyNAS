//const events = require('events');
const sqlite3 = require('sqlite3').verbose();
const log4js = require('log4js');
const uuidv4 = require('uuid/v4');
const config = require('../../../config');

//class sqlitehelper extends events {
class sqlitehelper {
    constructor() {
        //super();

        this.conf = config();
        log4js.configure(config(1));
        this.logger = log4js.getLogger('sqlite-helper.index');

        this.conn = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.conn = new sqlite3.Database(this.conf.sql.sqlite.path, (err) => {
                if (err) {
                    this.logger.error(`randy.nas connect the sqlite3 database[${this.conf.sql.sqlite.path}] error:[${err}]`);
                    reject('conn.error');
                }
                else {
                    this.logger.info(`randy.nas connect the sqlite3 database[${this.conf.sql.sqlite.path}] okey`);
                    resolve('conn.okey');
                }
                //this.emit('sqliteres', err, 'init');
            });
        });
    }

    test() {
        // for (let i = 0; i < 10; i++)
        //     this.logger.info(uuidv4());
        this.conn.serialize(() => {
            // let sql = this.conn.prepare('insert into sys_user(id,username,password,utype,stime) values(?,?,?,?,?)');
            // for (let i = 0; i < 10; i++) {
            //     let [id, username, password, utype, stime] = [uuidv4(), `chk${i}`, uuidv4(), 'test', Date.now()];
            //     this.logger.info(id, username, password, utype, stime);
            //     sql.run([id, username, password, utype, stime]);
            // }
            // sql.finalize();

            let sql = this.conn.prepare('insert into sys_user(id,username,password,utype,stime) values($id,$username,$password,$utype,$stime);');
            for (let i = 0; i < 10; i++) {
                //let [$id, $username, $password, $utype, $stime] = [uuidv4(), `chk${i}`, uuidv4(), 'test', Date.now()];
                let val = {
                    $id: uuidv4(),
                    $username: `chk${i}`,
                    $password: uuidv4(),
                    $utype: 'test',
                    $stime: Date.now()
                };
                //this.logger.info(val);
                sql.run(val, (err) => {
                    if (err) {
                        this.logger.error('func test() sql.run error:\r\n', val, '\r\n', err, '\r\n');
                    }
                    else {
                        this.logger.info('func test() sql.run okey.\r\n', val, '\r\n');
                    }
                });
            }
            sql.finalize((err) => {
                if (err) {
                    this.logger.error('func test() sql.finalize error:\r\n', err);
                }
                else {
                    this.logger.info('func test() sql.finalize okey.');
                }
            });
        });
    }

    /**
     * return {res:int, err:[]}
     * @param {object} so(sql object) 
     * {   
     *  sql:'insert into sys_user(id,username,password,utype,stime) values($id,$username,$password,$utype,$stime)',
     *  val:[{ $id: uuidv4(), $username: `chk${i}`, $password: uuidv4(), $utype: 'test', $stime: Date.now() }]
     * }
     */
    sqlexec(so) {
        return new Promise((resolve, reject) => {
            this.conn.serialize(() => {
                let res = { res: 0, err: [] };
                let sql = this.conn.prepare(so.sql);
                for (let i = 0, len = so.val.length; i < len; i++) {
                    sql.run(so.val[i], (err) => {
                        if (err) {
                            res.err.push({ error: err, val: so.val[i] });
                            this.logger.error(`class method sqlexec[${so.sql.substr(0, 6)}] sql.run error:\r\n`, so.val[i], '\r\n', err, '\r\n');
                        }
                        else {
                            res.res += 1;
                            //this.logger.info(`class method sqlexec[${so.sql.substr(0, 6)}] sql.run okey.\r\n`, so.val[i], '\r\n');
                        }
                    });
                }
                sql.finalize((err) => {
                    if (err) {
                        this.logger.error(`class method sqlexec[${so.sql.substr(0, 6)}] sql.finalize error:\r\n`, err);
                        res.err.push({ error: err });
                        reject(res);
                    }
                    else {
                        this.logger.info(`class method sqlexec[${so.sql.substr(0, 6)}] sql.finalize okey.\r\n`);
                        resolve(res);
                    }
                });
            });
        });
    }

    /**
     * return {row}
     * @param {object} so(sql object) 
     * {   
     *  sql:'select * from sys_action where id=$id;',
     *  val:{ $id: '20a7f0b2-3df8-4c6e-b495-cceac0ecef22' }
     * }
     */
    sqlget(so) {
        return new Promise((resolve, reject) => {
            this.conn.serialize(() => {
                let sql = this.conn.get(so.sql, so.val, (err, row) => {
                    if (err) {
                        this.logger.error('class method sqlget error:\r\n', err);
                        reject(err);
                    }
                    else {
                        this.logger.info('class method sqlget okey.\r\n');
                        resolve(row);
                    }
                });
            });
        });
    }

    /**
     * return rows[row,row]
     * @param {object} so(sql object) 
     * {   
     *  sql:'select * from sys_action where id<>$id;',
     *  val:{ $id: '20a7f0b2-3df8-4c6e-b495-cceac0ecef22' }
     * }
     */
    sqlall(so) {
        return new Promise((resolve, reject) => {
            this.conn.serialize(() => {
                this.conn.all(so.sql, so.val, (err, rows) => {
                    if (err) {
                        this.logger.error('class method sqlall error:\r\n', err);
                        reject(err);
                    }
                    else {
                        this.logger.info('class method sqlall okey.\r\n');
                        resolve(rows);
                    }
                });
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.conn.close((err) => {
                if (err) {
                    this.logger.error(`randy.nas sqlite3 database close error:${err}`);
                    reject(`close error: ${err}`);
                }
                else {
                    this.logger.info('randy.nas sqlite3 database close success.');
                    resolve('close okey')
                }
            });
        });
    }
}

module.exports = sqlitehelper;