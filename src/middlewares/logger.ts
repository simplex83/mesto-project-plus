/* eslint-disable import/no-extraneous-dependencies */
import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';
import WinstonTelegram from 'winston-telegram';

// eslint-disable-next-line no-unused-vars
const transport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

const telegramTransport = new WinstonTelegram({
  token: '6182862556:AAHEo_hNilCAQ7UVUv3B-o7ZHfQEVMhV9yQ',
  chatId: 197543593,
});

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'request.log',
    }),
    telegramTransport,
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

export default {
  requestLogger,
  errorLogger,
};
