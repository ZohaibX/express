const User = require('../../graphql/models/auth');
const Task = require('../../graphql/models/task');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const taskResolvers = require('../../graphql/resolvers/task-resolver');

describe('insert', () => {
  let connection;
  let db;

  beforeEach(async () => {
    mongo = new MongoMemoryServer();
    await mongoose.connect('mongodb://localhost/tests', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    // await connection.close();
    // await db.close();
  });

  describe('GET ALL TASKS', () => {
    let user,
      req = {},
      args = {};

    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId().toHexString(),
        email: 'mymail',
      });

      req.userId = user._id;
    });
    it('should  throw unauthorized error', async () => {
      req.userId = '123';
      await expect(taskResolvers.getAllTasks(args, req)).rejects.toThrow();
    });

    it('should not throw unauthorized error', async () => {
      await expect(taskResolvers.getAllTasks(args, req)).resolves.not.toThrow();
    });

    it('should return empty array', async () => {
      await expect(taskResolvers.getAllTasks(args, req)).resolves.toEqual([]);
    });

    it('should not return an empty array', async () => {
      req.userId = '5f8aa7f103b9114698c14514'; // some well known user Id, which have tasks
      await expect(taskResolvers.getAllTasks(args, req)).resolves.not.toEqual(
        []
      );
    });
  });
});
