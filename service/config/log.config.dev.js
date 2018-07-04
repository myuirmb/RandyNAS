const config = {
    appenders: {
        console: {
            type: 'console'
        },
        datafiles: {
            type: 'dateFile',
            alwaysIncludePattern: true,
            filename: '../logs/randy.nas.log_',
            pattern: 'yyyy-MM-dd.log'
        }
    },
    categories: {
        default: {
            appenders: ['console', 'datafiles'],
            level: 'trace'
        }
    }
};

module.exports = config;