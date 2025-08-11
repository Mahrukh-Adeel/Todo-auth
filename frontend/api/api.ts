import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';
axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await axios.post('/api/auth/register', { username, email, password });
    return response.data;
  }
};

export const todos = {
  getAll: async () => {
    const response = await axios.get('/api/todos');
    return response.data;
  },
  
  create: async (text: string) => {
    const response = await axios.post('/api/todos', { text });
    return response.data;
  },
  
  update: async (id: string, updates: { text?: string; completed?: boolean }) => {
    const response = await axios.patch(`/api/todos/${id}`, updates);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await axios.delete(`/api/todos/${id}`);
    return response.data;
  }
};

export const getTodos = todos.getAll;