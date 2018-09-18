const events = require('events');
const sqlite3 = require('sqlite3').verbose();
const log4js = require('log4js');
const uuidv4 = require('uuid/v4');
const config = require('../../../config');


class sqlitehelper extends events {
    constructor() {
        super();
        this.logger = null;
        this.conn = null;

        //this.init();
    }

    init() {
        let conf = config();

        log4js.configure(config(1));
        this.logger = log4js.getLogger('sqlite-helper.index');

        this.conn = new sqlite3.Database(conf.sql.sqlite.path, (err) => {
            if (err) {
                this.logger.error(`randy.nas connect the sqlite3 database[${conf.sql.sqlite.path}] error:[${err}]`);
            }
            else {
                this.logger.info(`randy.nas connect the sqlite3 database[${conf.sql.sqlite.path}] okey`);
            }
            this.emit('sqliteres', err, 'init');
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
                this.logger.info(val);
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
     * @param flag {string}
     */
    sqlexec(so, flag) {
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
                        this.logger.info(`class method sqlexec[${so.sql.substr(0, 6)}] sql.run okey.\r\n`, so.val[i], '\r\n');
                    }
                });
            }
            sql.finalize((err) => {
                if (err) {
                    this.logger.error(`class method sqlexec[${so.sql.substr(0, 6)}] sql.finalize error:\r\n`, err);
                    res.err.push({ error: err });
                }
                else {
                    this.logger.info(`class method sqlexec[${so.sql.substr(0, 6)}] sql.finalize okey.\r\n`);
                }

                this.emit('sqliteres', res, `sqlexec_${flag}`);
            });
        });
    }

    /**
     * return {res:row, err:[]}
     * @param {object} so(sql object) 
     * {   
     *  sql:'select * from sys_action where id=$id;',
     *  val:{ $id: '20a7f0b2-3df8-4c6e-b495-cceac0ecef22' }
     * }
     * @param flag {string}
     */
    sqlget(so, flag) {
        this.conn.serialize(() => {
            //let res = { res: 0, err: [] };
            let sql = this.conn.get(so.sql, so.val, (err, row) => {
                if (err) this.logger.error('class method sqlget error:\r\n', err);
                else this.logger.info('class method sqlget okey.\r\n');

                this.emit('sqliteres', { res: row, err: err }, `sqlget_${flag}`);
            });
        });
    }

    /**
     * return {res:[row,row, ...], err:[]}
     * @param {object} so(sql object) 
     * {   
     *  sql:'select * from sys_action where id<>$id;',
     *  val:{ $id: '20a7f0b2-3df8-4c6e-b495-cceac0ecef22' }
     * }
     * @param flag {string}
     */
    sqlall(so, flag) {
        this.conn.serialize(() => {
            //let res = { res: 0, err: [] };
            let sql = this.conn.all(so.sql, so.val, (err, rows) => {
                if (err) this.logger.error('class method sqlall error:\r\n', err);
                else this.logger.info('class method sqlall okey.\r\n');

                this.emit('sqliteres', { res: rows, err: err }, `sqlall_${flag}`);
            });
        });
    }

    close() {
        this.conn.close((err) => {
            if (err) this.logger.error(`randy.nas sqlite3 database close error:${err}`);
            else this.logger.info('randy.nas sqlite3 database close success.');

            this.emit('sqliteres', err, 'close');
        });
    }
}

module.exports = sqlitehelper;