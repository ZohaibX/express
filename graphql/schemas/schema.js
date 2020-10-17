const { buildSchema } = require('graphql');

// Schema of every type should be according to its model fro mongoose
module.exports = buildSchema(`

type Task {
  _id: ID!
  title : String!
  createdDate : String!
  students: [Student]
  user: Auth
}
type Student {
  _id: ID! 
  name: String!
  studentID: String!
  status: String!
  tasks: [Task]
}
type Auth {
  user_id: ID! 
  token: String!
  expiresIn: String!
  tasks: [Task]!
  students: [Student]!
}

input TaskData {
  title : String!
}
input StudentData {
  name: String!
  status: String!
  batchID: String!
  roll_no: String!
  dptID: String!
}
input AuthInput{
  username: String!
  email: String!
  password: String!
  authLevel: String!
}

type RootQuery {
  getAllTasks : [Task]
  getTask(id : ID! ) : Task

  getStudents: [Student]
  getStudent(id: ID!): Student
}

type RootMutation {
  createTask(taskData :  TaskData) : Task
  changeTitle(id: ID! , title: String!): Task
  deleteTask(id: ID!): Task 
  assignSingleStudentToTask(studentID: ID! , taskID: ID!): Task

  createStudent(studentData: StudentData): Student
  updateStatus(id: ID! , status: String!): Student
  deleteStudent(id: ID!): Student
  assignSingleTaskToStudent(studentID: ID! , taskID: ID!): Student

  signUp(authInput: AuthInput): Auth
  signIn(email: String! , password: String!): Auth
}

schema {
  query : RootQuery ,
  mutation : RootMutation
}

`);

// very very very important note .. root query and mutation mai .. returning data pr ! nai lagaana .. wrna errors return nai kre gha
//name : String! , description : String! , category : String! , instructions : String! , username : String

// in inputs, some fields are provided by default, so not to use ! with that fields
