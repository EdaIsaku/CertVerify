const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const infoLogger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './public/logger/info.log' }),
  ],
});

const errorLogger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './public/logger/error.log' }),
  ],
});

module.exports = { infoLogger, errorLogger };
