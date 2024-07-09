import React, { useState, useEffect } from 'react';
import './TaskList.css'; // Import your CSS file for styling
import Navbar from '../components/Navbar';
import { useUser } from "@clerk/clerk-react";
import UpdateTaskModal from '../pages/UpdateTaskModal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // Define filteredTasks here
  const [filter, setFilter] = useState('all'); // Define filter state here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailId, setEmailId] = useState('');
  const { user } = useUser();
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    if (user) {
      setEmailId(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);


  useEffect(() => {
    if (emailId) {
      const fetchTasks = async () => {
        try {
          const response = await fetch('https://intellitask-4q44.onrender.com/alltask');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setTasks(data);
          setFilteredTasks(data); 
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [emailId]);

  useEffect(() => {
    let filtered = tasks;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.Status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.Priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [statusFilter, priorityFilter, tasks]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.Status === filter));
    }
  }, [filter, tasks]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`https://intellitask-4q44.onrender.com/deletetask/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const handleCollaborate = async (taskId) => {
    try {
      const response = await fetch(`https://intellitask-4q44.onrender.com/requestcollaboration/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailId }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error requesting collaboration:', error.message);
    }
  };

  const handleUpdate = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`https://intellitask-4q44.onrender.com/updatetask/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedTaskData = await response.json();
      setTasks(tasks.map(task => task._id === taskId ? updatedTaskData : task));
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };
  
  const handleUpdateClick = (task) => {
    setTaskToUpdate(task);
    setIsModalOpen(true);
  };

  const handleAcceptRequest = async (taskId, email) => {
    try {
      const response = await fetch(`https://intellitask-4q44.onrender.com/acceptcollaboration/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error accepting collaboration request:', error.message);
    }
  };

  const handleRejectRequest = async (taskId, email) => {
    try {
      const response = await fetch(`https://intellitask-4q44.onrender.com/rejectcollaboration/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error rejecting collaboration request:', error.message);
    }
  };

  const getTaskCount = (status) =>{
    if(status==='all'){
      return tasks.length
    }
    return tasks.filter(task => task.Status === status).length
  }
  

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'priority':
        setPriorityFilter(value);
        break;
      default:
        break;
    }
  };

  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
      <div className="filter-button-container">
          <button className={`filter-button ${filterMenuOpen ? 'active' : ''}`} onClick={() => setFilterMenuOpen(!filterMenuOpen)}>
            Filter Tasks
          </button>
          {filterMenuOpen && (
            <div className="filter-menu">
              <div
                className={`filter-menu-item ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'all')}
              >
                Status: All
              </div>
              <div
                className={`filter-menu-item ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'pending')}
              >
                Status: Pending
              </div>
              <div
                className={`filter-menu-item ${statusFilter === 'ongoing' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'ongoing')}
              >
                Status: Ongoing
              </div>
              <div
                className={`filter-menu-item ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'completed')}
              >
                Status: Completed
              </div>
              <div
                className={`filter-menu-item ${priorityFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('priority', 'all')}
              >
                Priority: All
              </div>
              <div
                className={`filter-menu-item ${priorityFilter === 'High' ? 'active' : ''}`}
                onClick={() => handleFilterChange('priority', 'High')}
              >
                Priority: High
              </div>
              <div
                className={`filter-menu-item ${priorityFilter === 'Low' ? 'active' : ''}`}
                onClick={() => handleFilterChange('priority', 'Low')}
              >
                Priority: Low
              </div> 
            </div>
          )}
        </div>

        <div className="sidebar">
          <ul>
          <li className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All Tasks ({getTaskCount('all')})
            </li>
            <li className={`filter-button ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
              Pending ({getTaskCount('pending')})
            </li>
            <li className={`filter-button ${filter === 'ongoing' ? 'active' : ''}`} onClick={() => setFilter('ongoing')}>
              Ongoing ({getTaskCount('ongoing')})
            </li>
            <li className={`filter-button ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
              Completed ({getTaskCount('completed')})
            </li>
          </ul>
        </div>

        {/* <div className="main-content"> */}
        
      <div className="task-list-container">
        {filteredTasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>{task.TaskName}</h3>
            <p>{task.Description}</p>
            <p>Due Date: {new Date(task.DueDate).toLocaleDateString()}</p>
            <p>Priority: {task.Priority}</p>
            <p>Status: {task.Status}</p>
            <p>Manager Id: {task.Owner}</p>
            <button className="update-button" onClick={() => handleUpdateClick(task)}>Update</button>
            {emailId === task.Owner && <button onClick={() => handleDelete(task._id)}>Delete</button>}
            <button onClick={() => handleCollaborate(task._id)}>Collaborate</button>
            {emailId === task.Owner && task.CollaborationRequests && task.CollaborationRequests.length > 0 && (
              <div className="collaboration-requests">
                <h4>Collaboration Requests</h4>
                <ul>
                  {task.CollaborationRequests.map((request, index) => (
                    <li key={index}>
                      {request.email} - {request.status}
                      {request.status === 'pending' && (
                        <div>
                          <button onClick={() => handleAcceptRequest(task._id, request.email)}>Accept</button>
                          <button onClick={() => handleRejectRequest(task._id, request.email)}>Reject</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {isModalOpen && (
          <UpdateTaskModal
            task={taskToUpdate}
            onClose={() => setIsModalOpen(false)}
            onSave={handleUpdate}
          />
        )}
      </div>
    </>
  );
};


export default TaskList;
