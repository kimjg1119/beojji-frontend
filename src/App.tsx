import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axiosInstance from './utils/axios';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import UserList from './components/UserList';
import RegisterPage from './components/RegisterPage';
import RegisterSuccessPage from './components/RegisterSuccessPage';
import LoginPage from './components/LoginPage';
import MyStatus from './components/MyStatus';
import AdminPage from './components/admin/AdminPage';
import ProblemPage from './components/ProblemPage';
import SubmissionPage from './components/SubmissionPage';
import MySubmissionsPage from './components/MySubmissionsPage';
import CourseListPage from './components/CourseListPage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubmitPage from './components/SubmitPage';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isLoggedInRef = useRef(isLoggedIn);

  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
  }, []);

  const fetchUserRole = useCallback(async () => {
    console.log('Fetching user role...');
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      handleLogout();
      return;
    }
    try {
      const response = await axiosInstance.get('/api/users/me');
      console.log('User role fetched:', response.data.role);
      setUserRole(response.data.role);
      setIsLoggedIn(true);
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Error fetching user role:', error);
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserRole();
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [fetchUserRole]);

  const handleLogin = async (token: string) => {
    console.log('handleLogin called with token:', token);
    localStorage.setItem('token', token);
    await fetchUserRole();
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-success" element={<RegisterSuccessPage />} />
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/courses" /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/my-status" 
            element={isLoggedIn ? <MyStatus /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={userRole === 'admin' ? <AdminPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/problem/:classProblemId" 
            element={isLoggedIn ? <ProblemPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/submit/:classProblemId" 
            element={isLoggedIn ? <SubmitPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-submissions" 
            element={isLoggedIn ? <MySubmissionsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/courses" 
            element={isLoggedIn ? <CourseListPage /> : <Navigate to="/login" />} 
          />
          <Route path="/submission/:id"
            element={isLoggedIn ? <SubmissionPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;