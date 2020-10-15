const bcrypt = require('bcryptjs');
const Auth = require('../models/auth');
const jwt = require('jsonwebtoken');
const logger = require('../../log/logger');
const {
  getAssignedStudentsToUser,
  getAssignedTasksToUser,
} = require('./helper-functions');

module.exports = {
  signUp: async (args, req) => {
    const { username, email, authLevel, password } = args.authInput;
    const transformedAuthLevel = authLevel.toUpperCase();

    if (transformedAuthLevel !== 'HOD' && transformedAuthLevel !== 'TEACHER')
      throw new Error('Auth Level Can Only Be HOD or Teacher');

    const emailAlreadyAvailable = await Auth.findOne({ email });
    if (emailAlreadyAvailable) throw new Error('Email is already Available');

    let user = new Auth();
    user.username = username;
    user.email = email;
    user.authLevel = transformedAuthLevel;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    try {
      user = await user.save();
    } catch (error) {
      throw new Error(error.message);
    }

    // JWT SIGN TOKEN
    const token = jwt.sign(
      {
        user_id: user._doc._id,
        email: user.email,
        username: user.username,
        userLevel: user.authLevel,
        admin: user.admin,
      },
      'secret',
      {
        expiresIn: '1h',
      }
    );

    logger.info('Signed Up => Token Generated');
    return {
      user_id: user.id,
      token,
      expiresIn: 1,
      students: getAssignedStudentsToUser(user._doc.students),
      tasks: getAssignedTasksToUser(user._doc.tasks),
    };
  },

  signIn: async (args, req) => {
    const { email, password } = args;

    const user = await Auth.findOne({ email });
    if (!user) throw new Error('User does not exist');

    // bcrypt compare - Validation
    const validatePassword = await bcrypt.hash(password, user.salt);
    if (validatePassword !== user.password) throw new Error('Unauthorized');

    // JWT SIGN TOKEN
    const token = jwt.sign(
      {
        user_id: user._doc._id,
        email: user.email,
        username: user.username,
        userLevel: user.authLevel,
        admin: user.admin,
      },
      'secret',
      {
        expiresIn: '1h',
      }
    );

    logger.info('Signed In => Token Generated');

    return {
      user_id: user.id,
      token,
      expiresIn: 1,
      students: getAssignedStudentsToUser(user._doc.students),
      tasks: getAssignedTasksToUser(user._doc.tasks),
    };
  },
};
