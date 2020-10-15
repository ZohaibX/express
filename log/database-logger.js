const Winston = require("winston");
require("winston-mongodb");

const winston = Winston.createLogger({
  levels: Winston.config.syslog.levels,
  transports: [
    new Winston.transports.MongoDB(
      {
        db: "mongodb://localhost/newVidly_tests",
      },
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    ),
  ],
});

module.exports = winston;
