const Task = require('../models/task');
const {
  getAssignedStudentsToTask,
  getTaskIdsByUser,
  assignTaskToUser,
  getCurrentUserData,
} = require('./helper-functions');
const mongoose = require('mongoose');
const { validateTaskInput } = require('./validation-functions');
const { clearHash } = require('../../services/cache');

module.exports = {
  getAllTasks: async (args, req) => {
    if (!req.userId) throw new Error('Unauthorized User');

    let tasks;

    try {
      tasks = await Task.find({
        user: req.userId,
      }).cache({ key: req.userId });
    } catch (error) {
      throw new Error(error);
    }

    return tasks.map((task) => ({
      ...task._doc,
      _id: task.id,
      createdDate: new Date(task._doc.createdDate).toISOString(),
      students: getAssignedStudentsToTask(task._doc.students),
    }));
  },

  getTask: async (args, req) => {
    //! This method is not good for authorization . we need to do it as GetAllTasks Method
    if (!req.userId) throw new Error('Unauthorized User');
    const taskIds = await getTaskIdsByUser(req.userId);

    const userSavedTask = taskIds.find(
      (taskId) => taskId.toString() === args.id.toString()
    );
    if (!userSavedTask) throw new Error('Task Not Found');

    const task = await Task.findById(args.id);

    return {
      ...task._doc,
      _id: task.id,
      createdDate: new Date(task._doc.createdDate).toISOString(),
      students: getAssignedStudentsToTask(task._doc.students),
    };
  },

  createTask: async (args, req) => {
    //! This method is not good for authorization . we need to do it as GetAllTasks Method
    if (!req.userId) throw new Error('Unauthorized User');

    const error = validateTaskInput(args.taskData);
    if (error) throw new Error(error);

    const task = new Task({
      title: args.taskData.title,
      students: args.taskData.students,
      user: mongoose.Types.ObjectId(req.userId),
    });

    try {
      const result = await task.save();

      // assigning this student to the auth user
      assignTaskToUser(req.userId, result.id); //! we don't need to assign this task to user if we follow GetAllTask Method
      clearHash(req.userId); //! Here we are removing the cache, so we may get updated data
      return {
        ...result._doc,
        _id: result.id,
        createdDate: new Date(result._doc.createdDate).toISOString(),
        students: getAssignedStudentsToTask(result._doc.students),
        user: getCurrentUserData(result._doc.user),
      };
    } catch (e) {
      throw e;
    }
  },

  changeTitle: async (args, req) => {
    //! This method is not good for authorization . we need to do it as GetAllTasks Method
    if (!req.userId) throw new Error('Unauthorized User');
    const taskIds = await getTaskIdsByUser(req.userId);

    const userSavedTask = taskIds.find(
      (taskId) => taskId.toString() === args.id.toString()
    );
    if (!userSavedTask) throw new Error('Task Not Found');

    const task = await Task.findByIdAndUpdate(
      args.id,
      { title: args.title },
      { new: true }
    );
    if (!task) throw new Error("Task couldn't be found");

    clearHash(req.userId); //! Here we are removing the cache, so we may get updated data

    return {
      ...task._doc,
      _id: task.id,
      createdDate: new Date(task._doc.createdDate).toISOString(),
      students: getAssignedStudentsToTask(task._doc.students),
    };
  },

  deleteTask: async (args, req) => {
    //! This method is not good for authorization . we need to do it as GetAllTasks Method
    if (!req.userId) throw new Error('Unauthorized User');
    const taskIds = await getTaskIdsByUser(req.userId);

    const userSavedTask = taskIds.find(
      (taskId) => taskId.toString() === args.id.toString()
    );
    if (!userSavedTask) throw new Error('Task Not Found');
    const task = await Task.findByIdAndDelete(args.id);
    if (!task) throw new Error("Task couldn't be found");
    clearHash(req.userId); //! Here we are removing the cache, so we may get updated data
    return {
      ...task._doc,
      _id: task.id,
      createdDate: new Date(task._doc.createdDate).toISOString(),
      students: getAssignedStudentsToTask(task._doc.students),
    };
  },

  assignSingleStudentToTask: async (args, req) => {
    const { studentID, taskID } = args;
    const task = await Task.findById(taskID);

    const studentAlreadyAvailable = task.students.find(
      (studentId) => studentId.toString() === studentID
    );
    if (studentAlreadyAvailable) {
      throw new Error('Student Already Assigned To This Task');
    }
    task.students = [...task.students, studentID];
    const updatedTask = await task.save();

    return {
      ...updatedTask._doc,
      _id: updatedTask.id,
      createdDate: new Date(task._doc.createdDate).toISOString(),
      students: getAssignedStudentsToTask(task._doc.students),
    };
  },
};
