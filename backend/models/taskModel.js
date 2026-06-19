const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
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

// virtual id for frontend compatibility
taskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
taskSchema.set('toJSON', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

const getAllTasks = async (options = {}) => {
  const { user, search, page = 1, limit = 20, sort = '-created_at' } = options;
  const query = {};
  if (user) query.user = user;
  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];

  const skip = (page - 1) * limit;
  const tasks = await Task.find(query).sort(sort).skip(skip).limit(limit).lean();
  const total = await Task.countDocuments(query);
  return { tasks, total };
};

const createTask = async ({ user, title, description, status }) => {
  const task = new Task({ user, title, description, status });
  return task.save();
};

const updateTaskStatus = async (id, status) => {
  return Task.findByIdAndUpdate(id, { status }, { new: true }).lean();
};

const deleteTask = async (id) => {
  const result = await Task.findByIdAndDelete(id);
  return result != null;
};

const getStats = async (user) => {
  const match = user ? { user } : {};
  const total = await Task.countDocuments(match);
  const pending = await Task.countDocuments({ ...match, status: 'Pending' });
  const completed = await Task.countDocuments({ ...match, status: 'Completed' });
  const inProgress = await Task.countDocuments({ ...match, status: 'In Progress' });
  return { total, pending, inProgress, completed };
};

module.exports = {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getStats,
  Task
};
