// $env:database="mongodb+srv://zohaib:1234@cluster0-vvrwq.mongodb.net/events?retryWrites=true&w=majority"
// $env:private_key = 1234
// mongodb+srv://zohaib:1234@cluster0-vvrwq.mongodb.net/events?retryWrites=true&w=majority&ssl=true
// "mongodb://localhost/newVidly_tests"

const express = require("express");
const app = express();

// Startup Routes
require("./startup/database-connection")();
require("./startup/routes")(app) ;

const logger = require("./log/logger");

const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan Enabled");
}

const port = process.env.PORT || 4000;

app.listen(port , () => {
  logger.info(`App is running on port ${port}`);
});