module.exports = function () {
  const joi = require('joi');
  joi.objectId = require('joi-objectid')(joi);
};
// now we can use joi.objectId anywhere
// in validation, we are allowed to do joi.objectId in schema
