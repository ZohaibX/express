module.exports = (app) => {
  // enabling cors for axios

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept , x-auth-jwtToken , Authorization'
    ); // i have set a x-auth-jwtToken by myself for jwtToken
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );

    next();
  });
};
