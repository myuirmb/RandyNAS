const config = {
    appid: 'a8b31e58-2422-5880-9b7e-85acbb724f45',
    http: {
        port: 13579
    },
    sql: {
        type: 'sqlite',
        sqlite: {
            path: './database/randy.nas.sqlite'
        },
        mysql: {}
    }
};

module.exports = config;