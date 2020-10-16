const Winston = require('winston');
require('winston-mongodb');
require('dotenv').config(); // to use dotenv file

const winston = Winston.createLogger({
  levels: Winston.config.syslog.levels,
  transports: [
    new Winston.transports.MongoDB(
      {
        db: process.env.DATABASE,
      },
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    ),
  ],
});

module.exports = winston;
