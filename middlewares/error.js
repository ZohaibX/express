const logger = require("../log/logger")
module.exports = function (err, req, res, next) {
  //const dbLogger = require("../logger/dbLogger");

  // every route will have this error message when their promise go to the catch block
  // we don't need to call next() bcoz it is gonna be the last middleware to be used in app.js file

  logger.log("error", err.message);
  res.status(500).send("Something Failed .. ");
};
