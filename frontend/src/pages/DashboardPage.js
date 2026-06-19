import React, { useEffect, useState } from 'react';
import { fetchTasks, completeTask, deleteTask } from '../services/taskService';

const filterOptions = ['All', 'Pending', 'In Progress', 'Completed'];

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Unable to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleComplete = async (taskId) => {
    setLoading(true);
    try {
      await completeTask(taskId);
      await loadTasks();
    } catch {
      setError('Unable to update task.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    setLoading(true);
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch {
      setError('Unable to delete task.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'All') return true;
    return task.status === statusFilter;
  });

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>Dashboard</h2>
          <p>Manage your project tasks in one place.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <label className="mb-0">Filter:</label>
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {filterOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading tasks...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredTasks.length === 0 && (
        <div className="empty-state alert alert-secondary">
          <h5>No tasks available</h5>
          <p>Create a new task using the Add Task page.</p>
        </div>
      )}

      {!loading && filteredTasks.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>{new Date(task.created_at).toLocaleString()}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      disabled={task.status === 'Completed'}
                      onClick={() => handleComplete(task.id)}
                    >
                      Complete
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
