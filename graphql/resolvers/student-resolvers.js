const Student = require('../models/student');
const {
  getAssignedTasksToStudent,
  assignStudentToUser,
  getStudentIdsByUser,
} = require('./helper-functions');
const { validateStudentInput } = require('./validation-functions');

module.exports = {
  getStudents: async (args, req) => {
    const studentIds = await getStudentIdsByUser(req.userId);
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
  },

  getStudent: async (args, req) => {
    const studentIds = await getStudentIdsByUser(req.userId);

    const userSavedStudent = studentIds.find(
      (studentId) => studentId.toString() === args.id.toString()
    );
    if (!userSavedStudent) throw new Error('Student Not Found');

    const student = await Student.findById(args.id);
    return {
      ...student._doc,
      _id: student.id,
      tasks: getAssignedTasksToStudent(student._doc.tasks),
    };
  },

  createStudent: async (args, req) => {
    const error = validateStudentInput(args.studentData);
    if (error) throw new Error(error);

    const { name, status, batchID, dptID, roll_no } = args.studentData;
    if (
      status !== 'JUNIOR' &&
      status !== 'SENIOR' &&
      status !== 'senior' &&
      status !== 'junior'
    ) {
      throw new Error('Student Status Can Only Be Junior Or Senior');
    }

    const student = new Student({
      name,
      status: status.toUpperCase(),
      studentID: `${batchID}-${dptID}-${roll_no}`,
    });

    try {
      const result = await student.save();

      // assigning this student to the auth user
      assignStudentToUser(req.userId, result.id);
      return {
        ...result._doc,
        _id: result.id,
        tasks: getAssignedTasksToStudent(result._doc.tasks),
      };
    } catch (e) {
      throw e;
    }
  },

  updateStatus: async (args, req) => {
    const studentIds = await getStudentIdsByUser(req.userId);

    const userSavedStudent = studentIds.find(
      (studentId) => studentId.toString() === args.id.toString()
    );
    if (!userSavedStudent) throw new Error('Student Not Found');

    const { id, status } = args;
    const transformedStatus = status.toUpperCase();

    if (transformedStatus !== 'JUNIOR' && transformedStatus !== 'SENIOR') {
      throw new Error('Student Status Can Only Be Junior Or Senior');
    }
    const student = await Student.findByIdAndUpdate(
      id,
      { status: status.toUpperCase() },
      { new: true }
    );
    if (!student) throw new Error("Student Couldn't Be Found");
    return {
      ...student._doc,
      _id: student.id,
      tasks: getAssignedTasksToStudent(student._doc.tasks),
    };
  },

  deleteStudent: async (args, req) => {
    const studentIds = await getStudentIdsByUser(req.userId);

    const userSavedStudent = studentIds.find(
      (studentId) => studentId.toString() === args.id.toString()
    );
    if (!userSavedStudent) throw new Error('Student Not Found');

    const student = await Student.findByIdAndDelete(args.id);
    if (!student) throw new Error("Student Couldn't Be Found");
    return {
      ...student._doc,
      _id: student.id,
      tasks: getAssignedTasksToStudent(student._doc.tasks),
    };
  },

  assignSingleTaskToStudent: async (args, req) => {
    const { studentID, taskID } = args;
    const student = await Student.findById(studentID);

    const taskAlreadyAvailable = student.tasks.find(
      (taskId) => taskId.toString() === taskID
    );
    if (taskAlreadyAvailable) {
      throw new Error('Task Already Assigned To This Student');
    }
    student.tasks = [...student.tasks, taskID];
    const updatedStudent = await student.save();

    return {
      ...updatedStudent._doc,
      _id: updatedStudent.id,
      tasks: getAssignedTasksToStudent(student._doc.tasks),
    };
  },
};
