require('dotenv').config(); // to use dotenv file

module.exports = function () {
  console.log(config.get('jwtPrivateKey')); //its a secret key
  if (!process.env.JWTKEY) {
    console.error('FATAL Error : jwt is not defined');
    process.exit(1);
  }
};
