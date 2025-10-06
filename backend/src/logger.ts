import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
  level: "info",
  format: isProd
    ? winston.format.json() 
    : winston.format.combine( 
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
          }`;
        })
      ),
  transports: [new winston.transports.Console()],
});

export default logger;
