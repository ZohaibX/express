const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// middlewares
const isAuth = require('../middlewares/auth');
const error = require('../middlewares/error');

// GQL
const Resolvers = require('../graphql/resolvers/resolvers');
const Schema = require('../graphql/schemas/schema');
const { graphqlHTTP } = require('express-graphql');

// Multer
const {
  fileFilter,
  fileStorage,
} = require('../upload-by-multer/multer-config');
const multer = require('multer');

// For Multer and graphql
module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  //-------------------------------------------CORS------------------------------------------
  // enabling cors for axios

  // enabling cors
  // app.use(function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept , x-auth-jwtToken , Authorization'
  //   ); // i have set a x-auth-jwtToken by myself for jwtToken
  //   res.header(
  //     'Access-Control-Allow-Methods',
  //     'GET, POST, OPTIONS, PUT, DELETE'
  //   );

  //   next();
  // });

  //-------------------------------------------CORS END------------------------------------------

  //-------------------------------------------GQL-------------------------------------------------------

  app.use(isAuth); // auth middleware

  app.use(
    '/graphql',
    graphqlHTTP({
      schema: Schema,
      rootValue: Resolvers,
      graphiql: true,
    })
  );

  //------------------------------------GQL Ends-------------------------------------------------------

  //---------------------------------------MULTER-------------------------------------------------------

  app.use('/public', express.static('public'));
  // we have access to the upload folder inside the public -- so we can use it in the frontend
  // this is how we can access its files -- http://localhost:3000/public/uploads/image.css

  app.use(
    multer({
      storage: fileStorage,
      fileFilter: fileFilter,
      limits: { fileSize: 5242880 },
    }).single('image')
  );

  const { images } = require('../upload-by-multer/image-upload.route');
  app.use('/images', images);

  //-----------------------------------MULTER ENDS-------------------------------------------------------

  app.use(error); // it is just a reference of error module
};
