const mongoose = require('mongoose');
const logger = require('../log/logger');
require('dotenv').config(); // to use dotenv file

module.exports = async function () {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.info('connected to local database');
  } catch (error) {
    logger.error('error in database connection: ', error);
  }
};
