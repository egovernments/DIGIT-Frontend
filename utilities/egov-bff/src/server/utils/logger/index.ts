import  { createLogger, format, transports } from "winston";

import config from "../../config";

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] [${level}]: ${message}`;
});

const logger = createLogger({
  format: format.combine(
    format.label({ label: 'BFF' }),
    format.timestamp({ format: " YYYY-MM-DD HH:mm:ss.SSSZZ " }),
    format.simple(),
    format.colorize(),
    myFormat
  ),
  transports: [new transports.Console()],
});

const DEFAULT_LOG_MESSAGE_COUNT = config.app.debugLogCharLimit;

export const getFormattedStringForDebug = (obj: any): string => {
  try {
    const convertedMessage = JSON.stringify(obj);
    return convertedMessage.slice(0, DEFAULT_LOG_MESSAGE_COUNT) +
      (convertedMessage.length > DEFAULT_LOG_MESSAGE_COUNT ? "\n ---more" : "");
  } catch (error : any ) {
    if (error instanceof RangeError && error.message.includes("Invalid string length")) {
      logger.error("The object is too big to convert into a string.");
    } else {
      logger.error(`An unexpected error occurred while formatting the object into a string : ${error?.message}`);
    }
    return "Error: Unable to format object for debug.";
  }
};


//export default logger;
export { logger };