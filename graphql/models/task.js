const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        default: [],
      },
    ],
  },
  { timestamps: true } // now it will have created at and updatedAt field
);

module.exports = mongoose.model('Task', taskSchema);
