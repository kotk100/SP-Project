var winston = require('winston');
const path = require('path');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'warn',
            timestamp: true
        }),
        new (winston.transports.File)({
            filename: path.join(__dirname, '../logs/debug.log'),
            level: 'debug',
            timestamp: true
        })
    ]
});

module.exports = logger;