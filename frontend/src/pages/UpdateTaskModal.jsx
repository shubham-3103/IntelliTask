import React, { useState } from 'react';
import './UpdateTaskModal.css'; // Import your CSS file for styling

const UpdateTaskModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.TaskName);
  const [description, setDescription] = useState(task.Description);
  const [dueDate, setDueDate] = useState(task.DueDate);
  const [status, setStatus] = useState(task.Status);
  const [priority, setPriority] = useState(task.Priority);
  const [collaborators, setCollaborators] = useState(task.Collaborators.join(', '));

  const handleSave = () => {
    const updatedTask = {
      TaskName: title,
      Description: description,
      DueDate: dueDate,
      Status: status,
      Priority: priority,
      Collaborators: collaborators.split(',').map(collab => collab.trim())
    };
    onSave(task._id, updatedTask);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Task</h2>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Due Date:
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          Priority:
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label>
          Collaborators:
          <input type="text" value={collaborators} onChange={(e) => setCollaborators(e.target.value)} />
        </label>
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
