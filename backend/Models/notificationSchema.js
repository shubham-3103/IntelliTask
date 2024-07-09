const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true },  // Email of the recipient
  type: { type: String, enum: ['collaboration', 'task'], required: true },  // Type of notification
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },  // Task ID related to notification
  message: { type: String, required: true },  // Notification message
  read: { type: Boolean, default: false },  // Read status of the notification
  createdAt: { type: Date, default: Date.now }  // Date of notification creation
});

module.exports = mongoose.model('Notification', notificationSchema);
