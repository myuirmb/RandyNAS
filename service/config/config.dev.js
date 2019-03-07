const config = {
    appid: 'a8b31e58-2422-5880-9b7e-85acbb724f45',
    appname: 'Randy.NAS',
    http: {
        port: 13579
    },
    sql: {
        type: 'sqlite',
        sqlite: {
            //path: './database/randy.nas.sqlite'
            path: 'D:\\Randy\\nase\\randynas\\service\\database\\randy.nas.sqlite'
        },
        mysql: {}
    },

    vfy: {
        guest: false,
        auto: 14 * 24 * 60 * 60 * 1000,    //14*24*60*60
        rsa: {
            // publickey: './config/public.key',
            // privatekey: './config/private.key'
            publickey: 'D:\\Randy\\nase\\randynas\\service\\config\\public.key',
            privatekey: 'D:\\Randy\\nase\\randynas\\service\\config\\private.key'
        }
    },

    seq: {  //sequence
        // n: ['3', '2', '7', '6', '9', '4', '5', '8', '1', '0'],
        // s: ['e', 'a', 'd', 'f', 'c', 'b'],
        n: ['3', '2', '7', '6', '9', '4', '5', '8', '1', '0', 'e', 'a', 'd', 'f', 'c', 'b'],
        a: '39c57ce4-3be9-4e8a-94a8-b86d3020dd36',
        m5: '51072f5f-941e-4478-9139-33a67162dcf5',
        s1: 'd8ddd1f1-00f6-442b-b88c-e122918835f5',
        s5: 'e2ff1f08-383b-438b-b14b-607e2e28bbb1'
    },

    upl: {
        temp: 'D:\\Randy\\nase\\randynas\\upload\\temp',
        dir: 'D:\\Randy\\nase\\randynas\\upload\\uploads'
    }
};

module.exports = config;