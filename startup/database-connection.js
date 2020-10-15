const mongoose = require("mongoose");
const logger = require("../log/logger")

module.exports = async function () {
  try {
    await mongoose.connect("mongodb://localhost/newVidly_tests", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("connected to database")
  } catch (error) {
    logger.error("error in database connection: " , error);
  }
};
