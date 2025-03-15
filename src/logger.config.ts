import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const formatter = ({ timestamp, level, message, ...meta }) => {
  const metaString = Object.keys(meta).length
    ? JSON.stringify(meta, null, 2)
    : '';
  const messageString =
    message instanceof Object ? JSON.stringify(message, null, 2) : message;
  return `${timestamp} [${level}]: ${message ? messageString : metaString} ${message ? metaString : ''}`;
};

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(formatter as any),
  ),
});

const fileTransport = new DailyRotateFile({
  filename: 'osbb-%DATE%.log',
  frequency: '24h',
  datePattern: 'YYYY-MM-DD',
  maxSize: '60m',
  maxFiles: '60d',
  level: 'debug',
  dirname: 'logs',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf(formatter as any),
  ),
});

const transports = [consoleTransport, fileTransport];

export const loggerOptions: winston.LoggerOptions = {
  level: 'debug',
  transports,
};
