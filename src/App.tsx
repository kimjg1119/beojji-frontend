import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyStatus from './components/card/MyStatus';
import UserList from './components/card/UserList';
import Layout from './components/Layout';
import AdminPage from './components/page/AdminPage';
import CourseListPage from './components/page/CourseListPage';
import HomePage from './components/page/HomePage';
import LoginPage from './components/page/LoginPage';
import MySubmissionPage from './components/page/MySubmissionPage';
import ProblemPage from './components/page/ProblemPage';
import RegisterPage from './components/page/RegisterPage';
import RegisterSuccessPage from './components/page/RegisterSuccessPage';
import SubmissionPage from './components/page/SubmissionPage';
import SubmitPage from './components/page/SubmitPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/globals.css';
import axiosInstance from './utils/axios';

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
      const response = await axiosInstance.get('user/me'); // Updated API path
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
            path="/problem/:courseProblemId" 
            element={isLoggedIn ? <ProblemPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/submit/:courseProblemId" 
            element={isLoggedIn ? <SubmitPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-submissions" 
            element={isLoggedIn ? <MySubmissionPage /> : <Navigate to="/login" />} 
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