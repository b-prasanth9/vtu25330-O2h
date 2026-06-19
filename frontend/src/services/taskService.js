import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export const fetchTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const completeTask = async (id) => {
  const response = await api.put(`/tasks/${id}`, { status: 'Completed' });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
