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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const auth = {
  // Initialize auth on app start
  init: () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const data = response.data.data || response.data;
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },
  
  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response = await axios.post('/api/auth/register', { username, email, password });
      const data = response.data.data || response.data;
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  setAuthToken: (token: string) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeAuthToken: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  // storeUser: (user: any) => {
  //   localStorage.setItem('user', JSON.stringify(user));
  // },

  // getStoredUser: () => {
  //   const userData = localStorage.getItem('user');
  //   return userData ? JSON.parse(userData) : null;
  // },

  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('user'); // Commented out - not storing user details
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const todos = {
  getAll: async () => {
    try {
      const response = await axios.get('/api/todos');
      return response.data.data || response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch todos';
      throw new Error(errorMessage);
    }
  },
  
  create: async (text: string) => {
    try {
      const response = await axios.post('/api/todos', { text });
      return response.data.data || response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create todo';
      throw new Error(errorMessage);
    }
  },
  
  update: async (id: string, updates: { text?: string; completed?: boolean }) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, updates);
      return response.data.data || response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update todo';
      throw new Error(errorMessage);
    }
  },
  
  delete: async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete todo';
      throw new Error(errorMessage);
    }
  }
};

export const getTodos = todos.getAll;

export default {
  auth,
  todos,
  getTodos
};