const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// middlewares
const isAuth = require("../middlewares/auth")
const error = require("../middlewares/error")

const Resolvers = require("../graphql/resolvers/resolvers")
const Schema = require("../graphql/schemas/schema");
const { graphqlHTTP } = require("express-graphql");

// For Multer and graphql
module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  //-------------------------------------------GQL-------------------------------------------------------

  app.use(isAuth); // auth middleware

  app.use(
    "/graphql",
    graphqlHTTP({
      schema: Schema,
      rootValue: Resolvers,
      graphiql: true,
    })
  );

  //------------------------------------GQL Ends-------------------------------------------------------
  
  app.use(error); // it is just a reference of error module
};
