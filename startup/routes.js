const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// middlewares
const isAuth = require("../middlewares/auth");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(isAuth); // auth middleware
  app.use(error); // it is just a reference of error middleware for error handling

  // Cors for axios
  require("../cors/cors")(app);

  // GQL
  require("../graphql/service/service")(app);

  // Multer
  require("../upload-by-multer/service")(app);

  // Redis
  require("../services/cache");
  // we must run a redis server to work with it
};
