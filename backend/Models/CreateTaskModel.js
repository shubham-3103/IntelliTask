// models/CreateTask.js
const mongoose = require('mongoose');

const createTaskSchema = new mongoose.Schema({
  TaskName: { type: String, required: true },
  Description: { type: String, required: true },
  DueDate: { type: Date, required: true },
  Priority: { type: String, required: true },
  Status: { type: String, default: 'pending' },
  Owner: {type: String, required: true},
  Collaborators: { type: [String] },
  CollaborationRequests: [{
    email: { type: String },
    status: { type: String, default: 'pending' }
  }]
});

const CreateTaskModel = mongoose.model('CreateTask', createTaskSchema);

module.exports = CreateTaskModel;
