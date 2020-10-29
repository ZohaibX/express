const Task = require('../models/task');
const Student = require('../models/student');
const Auth = require('../models/auth');
const Image = require('../../upload-by-multer/image-upload.model');

const getAssignedTasksToStudent = async (taskIds) => {
  const tasks = await Task.find({
    _id: {
      $in: taskIds,
    },
  });

  // Its a simple returning function
  // to change every data id
  // here we used map fn to change id of each data
  return tasks.map((task) => ({
    ...task._doc,
    _id: task.id,
    createdDate: new Date(task._doc.createdDate).toISOString(),
    students: getAssignedStudentsToTask(task._doc.students),
  }));
};
const getAssignedStudentsToTask = async (studentIds) => {
  const students = await Student.find({
    _id: {
      $in: studentIds,
    },
  });

  // Its a simple returning function
  // to change every data id
  // here we used map fn to change id of each data
  return students.map((student) => ({
    ...student._doc,
    _id: student.id,
    tasks: getAssignedTasksToStudent(student._doc.tasks),
  }));
};

const getAssignedStudentsToUser = async (studentId) => {
  const students = await Student.find({
    _id: {
      $in: studentId,
    },
  });

  return students.map((student) => ({
    ...student._doc,
    _id: student.id,
    tasks: getAssignedTasksToStudent(student._doc.tasks),
  }));
};
const getAssignedTasksToUser = async (taskId) => {
  const tasks = await Task.find({
    _id: {
      $in: taskId,
    },
  });

  return tasks.map((task) => ({
    ...task._doc,
    _id: task.id,
    students: getAssignedStudentsToTask(task._doc.students),
  }));
};

const assignStudentToUser = async (userId, studentId) => {
  const user = await Auth.findOne({ _id: userId });
  if (!user) throw new Error('Auth Required');

  user.students = [...user.students, studentId];
  try {
    await user.save();
  } catch (e) {
    throw new Error(e.message);
  }
};
const assignTaskToUser = async (userId, taskId) => {
  const user = await Auth.findOne({ _id: userId });
  if (!user) throw new Error('Auth Required');

  user.tasks = [...user.tasks, taskId];
  try {
    await user.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

const getStudentIdsByUser = async (userId) => {
  const user = await Auth.findOne({ _id: userId });
  return user.students;
};
const getTaskIdsByUser = async (userId) => {
  const user = await Auth.findOne({ _id: userId });
  return user.tasks;
};

const getCurrentUserData = async (userId) => {
  const user = await Auth.findOne({ _id: userId });
  if (!user) throw new Error('Unauthorized');

  return {
    ...user._doc,
    _id: user.id,
    students: getAssignedStudentsToUser(user._doc.students),
    tasks: getAssignedTasksToUser(user._doc.tasks),
  };
};

module.exports.getAssignedStudentsToTask = getAssignedStudentsToTask;
module.exports.getAssignedTasksToStudent = getAssignedTasksToStudent;
module.exports.getAssignedStudentsToUser = getAssignedStudentsToUser;
module.exports.getAssignedTasksToUser = getAssignedTasksToUser;

module.exports.assignStudentToUser = assignStudentToUser;
module.exports.assignTaskToUser = assignTaskToUser;
module.exports.getStudentIdsByUser = getStudentIdsByUser;
module.exports.getTaskIdsByUser = getTaskIdsByUser;

module.exports.getCurrentUserData = getCurrentUserData;
