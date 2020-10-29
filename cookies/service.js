const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('../config/keys');

console.log('Cookies File Compiled');
module.exports = (app) => {
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey],
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
