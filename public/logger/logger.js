const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
  transports: [
    new transports.File({
      filename: './public/logger/info.log',
      level: 'info',
    }),
    new transports.File({
      filename: './public/logger/error.log',
      level: 'error',
    }),
  ],
});

module.exports = { logger };
