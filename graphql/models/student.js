const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    studentID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: [],
      },
    ],
  },
  { timestamps: true } // now it will have created at and updatedAt field
);

module.exports = mongoose.model('Student', studentSchema);
