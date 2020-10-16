const { exceptionModule, transports } = require('../log/uncaught-exceptions');
const logger = require('../log/logger');

module.exports = function () {
  exceptionModule.exceptions.handle(
    new transports.File({ filename: 'exceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    logger.error('Error in Promises', ex);
  });
};
