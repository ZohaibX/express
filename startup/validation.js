module.exports = function () {
  const joi = require('joi');
  joi.objectId = require('joi-objectid')(joi);
};
// now we can use joi.objectid anywhere
