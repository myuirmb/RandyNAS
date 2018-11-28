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
    },
    seq: {  //sequence
        // n: ['3', '2', '7', '6', '9', '4', '5', '8', '1', '0'],
        // s: ['e', 'a', 'd', 'f', 'c', 'b'],
        n: ['3', '2', '7', '6', '9', '4', '5', '8', '1', '0', 'e', 'a', 'd', 'f', 'c', 'b'],
        a: '39c57ce4-3be9-4e8a-94a8-b86d3020dd36',
    }
};

module.exports = config;