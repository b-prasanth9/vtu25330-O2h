import React, { useCallback, useEffect, useState } from 'react';
import { fetchTasks, completeTask, deleteTask, getStats } from '../services/taskService';

const filterOptions = ['All', 'Pending', 'In Progress', 'Completed'];

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('-created_at');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchTasks({ search, page, limit, sort });
      setTasks(result.tasks || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError('Unable to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, sort]);

  const loadStats = useCallback(async () => {
    try {
      const d = await getStats();
      setStats(d);
    } catch {}
  }, []);

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

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
      // reload current page
      await loadTasks();
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
          <input className="form-control" placeholder="Search tasks" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="-created_at">Newest</option>
            <option value="created_at">Oldest</option>
          </select>
        </div>
      </div>

      {stats && (
        <div className="mb-3 d-flex gap-3">
          <div className="card p-2"><strong>Total</strong><div>{stats.total}</div></div>
          <div className="card p-2"><strong>Pending</strong><div>{stats.pending}</div></div>
          <div className="card p-2"><strong>In Progress</strong><div>{stats.inProgress}</div></div>
          <div className="card p-2"><strong>Completed</strong><div>{stats.completed}</div></div>
        </div>
      )}

      {loading && <div className="alert alert-info">Loading tasks...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredTasks.length === 0 && (
        <div className="empty-state alert alert-secondary">
          <h5>No tasks available</h5>
          <p>Create a new task using the Add Task page.</p>
        </div>
      )}

      {!loading && filteredTasks.length > 0 && (
        <>
          <div className="task-table table-responsive d-none d-md-block">
            <table className="table table-hover align-middle table-custom">
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
                  <td className="text-truncate" style={{maxWidth:200}}>{task.description}</td>
                  <td>
                    <span className={`badge-status ${task.status === 'Pending' ? 'badge-pending' : task.status === 'In Progress' ? 'badge-inprogress' : 'badge-completed'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>{new Date(task.created_at).toLocaleString()}</td>
                  <td className="d-flex gap-2 task-actions">
                    <button
                      className="btn btn-sm btn-outline-success"
                      disabled={task.status === 'Completed'}
                      onClick={() => handleComplete(task.id)}
                    >
                      Complete
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Card list for small screens */}
          <div className="task-cards d-block d-md-none">
            <div className="row g-3">
              {filteredTasks.map((task) => (
                <div className="col-12" key={task.id}>
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{task.title}</h5>
                        <p className="mb-1 text-muted small">{task.description}</p>
                        <div className="mt-2">
                          <span className={`badge-status ${task.status === 'Pending' ? 'badge-pending' : task.status === 'In Progress' ? 'badge-inprogress' : 'badge-completed'}`}>{task.status}</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block mb-2">{new Date(task.created_at).toLocaleString()}</small>
                        <div className="d-flex flex-column gap-2">
                          <button className="btn btn-sm btn-outline-success" disabled={task.status === 'Completed'} onClick={() => handleComplete(task.id)}>Complete</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>Showing {(page-1)*limit + 1} - {Math.min(page*limit, total)} of {total}</div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" disabled={page<=1} onClick={() => setPage((p)=>p-1)}>Prev</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={page*limit>=total} onClick={() => setPage((p)=>p+1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
