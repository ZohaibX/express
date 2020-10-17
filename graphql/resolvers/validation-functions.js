const joi = require('joi');

function validateTaskInput(reqBody) {
  const schema = joi.object({ title: joi.string().max(50).min(5).required() });
  const validation = schema.validate(reqBody);

  if (validation.error) return validation.error.details[0].message;
  return null;
}

function validateStudentInput(reqBody) {
  const schema = joi.object({
    name: joi.string().max(50).min(5).required(),
    status: joi.string().max(10).min(1).required(),
    batchID: joi.string().max(4).min(1).required(),
    roll_no: joi.string().max(3).min(1).required(),
    dptID: joi.string().max(3).min(1).required(),
  });
  const validation = schema.validate(reqBody);

  if (validation.error) return validation.error.details[0].message;
  return null;
}

function validateAuthInput(reqBody) {
  const schema = joi.object({
    username: joi.string().min(5).max(50).required(),
    email: joi.string().max(50).min(5).required(),
    password: joi.string().max(50).min(5).required(),
    authLevel: joi.string().max(10).min(1).required(),
  });
  const validation = schema.validate(reqBody);

  if (validation.error) return validation.error.details[0].message;
  return null;
}

module.exports.validateTaskInput = validateTaskInput;
module.exports.validateStudentInput = validateStudentInput;
module.exports.validateAuthInput = validateAuthInput;
