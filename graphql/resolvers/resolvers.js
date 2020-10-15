const tasks = require('./task-resolver');
const students = require('./student-resolvers');
const auth = require('./auth-resolvers');

const rootResolver = {
  ...tasks,
  ...students,
  ...auth,
};

module.exports = rootResolver;
