const express = require('express');
const router = express.Router();
const CreateTaskModel = require('../Models/CreateTaskModel')


router.post('/createtask', async (req, res) => {
    try {
      const { TaskName, Description, DueDate, Priority, Status, Owner, Collaborators  } = req.body;
      if (!TaskName || !Description || !DueDate || !Priority || !Status || !Owner ) {
        return res.status(400).send({ message: 'Send all required fields' });
      }
  
      const newTask = { TaskName, Description, DueDate, Priority, Status, Owner, Collaborators };
      const task = await CreateTaskModel.create(newTask);
      return res.status(201).send(task);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: error.message });
    }
  });

router.get('/alltask', async function(req,res){
    try {
        const Task = await CreateTaskModel.find({});
        return res.status(200).json(Task);
      } catch (error) {
          console.log(error.message);
          res.status(500).send({message: error.message})
      }
})
router.delete('/deletetask/:id',async function(req,res){
  try{
    const task = await CreateTaskModel.findByIdAndDelete(req.params.id) 
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    return res.status(200).send({ message: 'Task deleted successfully' });
  }catch(error){
    console.log(error.message)
    res.status(500).send({ message: error.message });
  }
})
router.post('/requestcollaboration/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { email } = req.body;
  try {
    const task = await CreateTaskModel.findById(taskId);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    const existingRequest = task.CollaborationRequests.find(request => request.email === email);
    if (existingRequest) {
      return res.status(400).send({ message: 'Collaboration request already exists' });
    }

    task.CollaborationRequests.push({ email, status: 'pending' });
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
router.post('/acceptcollaboration/:id', async function(req, res) {
  try {
    const task = await CreateTaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    const { email } = req.body;
    const requestIndex = task.CollaborationRequests.findIndex(req => req.email === email);
    if (requestIndex === -1) {
      return res.status(400).send({ message: 'Collaboration request not found' });
    }
    task.CollaborationRequests[requestIndex].status = 'accepted';
    task.Collaborators.push(email);
    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post('/rejectcollaboration/:id', async function(req, res) {
  try {
    const task = await CreateTaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    const { email } = req.body;
    const requestIndex = task.CollaborationRequests.findIndex(req => req.email === email);
    if (requestIndex === -1) {
      return res.status(400).send({ message: 'Collaboration request not found' });
    }
    task.CollaborationRequests[requestIndex].status = 'rejected';
    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.post('/updatetask/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { TaskName, Description, DueDate, Priority, Status, Collaborators } = req.body;

    const task = await CreateTaskModel.findById(id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }

    task.TaskName = TaskName || task.TaskName;
    task.Description = Description || task.Description;
    task.DueDate = DueDate || task.DueDate;
    task.Priority = Priority || task.Priority;
    task.Status = Status || task.Status;
    task.Collaborators = Collaborators || task.Collaborators;

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});








module.exports = router;