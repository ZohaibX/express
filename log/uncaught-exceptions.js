const { createLogger, transports } = require("winston");
const logger = createLogger({
  transports: [
    new transports.File({ filename: "combined.log" }),
    new transports.Console({
      handleExceptions: true,
    }),
  ],
});
module.exports.exceptionModule = logger;
module.exports.transports = transports;
