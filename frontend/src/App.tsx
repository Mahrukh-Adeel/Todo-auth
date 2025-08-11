import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import TodoList from "./components/TodoList";
import type { Todo } from "./types/todo";
import type { User } from "./types/user";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

axios.defaults.baseURL = API_BASE_URL;

function App(){
  const [mode, setMode] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setMode('todos');
      await fetchTodos();
      
    } catch (error: unknown) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw new Error('Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setMode('todos');
      
      await fetchTodos();
      
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setTodos([]);
    setMode('');
  };

  const handleAddTodo = async (text: string) => {
    try {
      const response = await axios.post('/api/todos', { text });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggle = async (id: string) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    if (!todoToUpdate) return;

    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todoToUpdate.completed,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEdit = async (id: string, newText: string) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: newText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  if (user && mode === 'todos') {
    return (
      <div className="p-4 w-full h-screen bg-rose-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-pink-800">
              Welcome, {user.username}!
            </h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a new todo"
              className="border border-pink-300 px-2 py-1 flex-grow rounded focus:border-pink-400"
              id="todo-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    handleAddTodo(input.value.trim());
                    input.value = '';
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById('todo-input') as HTMLInputElement;
                if (input && input.value.trim()) {
                  handleAddTodo(input.value.trim());
                  input.value = '';
                }
              }}
              className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 font-medium"
            >
              Add
            </button>
          </div>
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    );
  }

  if (mode === '') {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-800 mb-8">Todo App</h1>
          <div className="space-y-4">
            <button
              className="bg-pink-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-pink-600 block mx-auto"
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-600 block mx-auto"
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return <LoginForm onLogin={login} onBack={() => setMode('')} />;
  }

  if (mode === 'signup') {
    return <SignupForm onRegister={register} onBack={() => setMode('')} />;
  }

  return null;
}

export default App;