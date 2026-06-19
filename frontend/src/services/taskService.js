import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

// attach token when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchTasks = async ({ search, page, limit, sort } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (sort) params.sort = sort;
  const response = await api.get('/tasks', { params });
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

export const getStats = async () => {
  const response = await api.get('/tasks/stats');
  return response.data;
};

export const authRegister = async ({ username, password }) => {
  const res = await api.post('/auth/register', { username, password });
  return res.data;
};

export const authLogin = async ({ username, password }) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};
