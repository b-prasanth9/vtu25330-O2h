const { getAllTasks, createTask, updateTaskStatus, deleteTask } = require('../models/taskModel');

const listTasks = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load tasks' });
  }
};

const addTask = async (req, res) => {
  const { title, description, status } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!description || description.trim().length < 20) {
    return res.status(400).json({ error: 'Description must be at least 20 characters' });
  }

  if (!status || !['Pending', 'In Progress'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Pending or In Progress' });
  }

  try {
    const task = await createTask({ title: title.trim(), description: description.trim(), status });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create task' });
  }
};

const completeTask = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTask = await updateTaskStatus(id, 'Completed');
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update task' });
  }
};

const removeTask = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete task' });
  }
};

module.exports = {
  listTasks,
  addTask,
  completeTask,
  removeTask
};
