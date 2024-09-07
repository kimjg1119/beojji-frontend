import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        onLogin(token);
        navigate('/');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <div className="relative">
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-2 bg-input-background dark:bg-gray-700 text-foreground dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="relative mt-4">
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-2 bg-input-background dark:bg-gray-700 text-foreground dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;