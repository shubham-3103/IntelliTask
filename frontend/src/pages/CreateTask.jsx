import React, { useState,useEffect } from 'react';
import './TaskForm.css'; // Import your CSS file for styling
import { useUser } from "@clerk/clerk-react";
import Navbar from '../components/Navbar';

const TaskForm = () => {
  // State to manage form inputs
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [emailId, setEmailId] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setEmailId(user.primaryEmailAddress.emailAddress);
      setLoading(false);
    }
  }, [user]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      TaskName: taskName,
      Description: description,
      DueDate: dueDate,
      Priority: priority,
      Status: 'pending', // Fixed status as 'pending'
      Owner: emailId
    };
    // console.log('Form Data:', formData);
    try {
      const response = await fetch('http://localhost:5000/createtask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Task created successfully:', data);
      // Optionally, reset form fields after successful submission
      setTaskName('');
      setDescription('');
      setDueDate('');
      setPriority('');

    } catch (error) {
      console.error('Error creating task:', error.message);
      // Handle error state or display error message to user
    }
  };

  return (
    <>
    <Navbar />
    <div className="task-form-container">
      <h2>Create a Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>
    </div></>
  );
};

export default TaskForm;
