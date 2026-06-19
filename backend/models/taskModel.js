const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

const Task = mongoose.model('Task', taskSchema);

const getAllTasks = async () => {
  return Task.find().sort({ created_at: -1 }).lean();
};

const createTask = async ({ title, description, status }) => {
  const task = new Task({ title, description, status });
  return task.save();
};

const updateTaskStatus = async (id, status) => {
  return Task.findByIdAndUpdate(id, { status }, { new: true }).lean();
};

const deleteTask = async (id) => {
  const result = await Task.findByIdAndDelete(id);
  return result != null;
};

module.exports = {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask
};
