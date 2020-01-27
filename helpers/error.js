const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

// Handle all the errors and log it to a file
const handleError = (error, res) => {
  if (!error.statusCode) {
    logger.info(error.message);
    logger.log('info', error.message);
    res.status(404).json({
      message: error.message
    });
  } else {
    const { statusCode, message } = error;
    logger.info('info', message);
    res.status(statusCode).json({
      statusCode,
      message
    });
  }
};
module.exports = { ErrorHandler, handleError };
