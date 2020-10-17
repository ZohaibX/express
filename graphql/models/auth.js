const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    authLevel: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    salt: {
      type: String,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        default: [],
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: [],
      },
    ],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        default: [],
      },
    ],
    pdfs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDF',
        default: [],
      },
    ],
  },
  { timestamps: true } // now it will have created at and updatedAt field
);

module.exports = mongoose.model('Auth', authSchema);
