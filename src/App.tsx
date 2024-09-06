import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import axiosInstance from './utils/axios';
import UserList from './components/UserList';
import RegisterPage from './components/RegisterPage';
import RegisterSuccessPage from './components/RegisterSuccessPage';
import LoginPage from './components/LoginPage';
import MyStatus from './components/MyStatus';
import AdminPage from './components/AdminPage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import ClassesPage from './components/ClassesPage';
import ProblemPage from './components/ProblemPage';
import SubmissionPage from './components/SubmissionPage';
import MySubmissionsPage from './components/MySubmissionsPage';

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
      if (axios.isAxiosError(error) && error.response?.data.message === 'TOKEN_EXPIRED') {
        handleLogout();
      }
      // For other errors, including TOKEN_INVALID, we don't log out
      // You might want to handle TOKEN_INVALID differently
    }
  }, [handleLogout]);

  useEffect(() => {
    console.log('useEffect running, isLoggedIn:', isLoggedInRef.current);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token has expired
          handleLogout();
        } else {
          fetchUserRole();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Token is invalid, but we don't log out
        // You might want to clear the invalid token from localStorage here
        localStorage.removeItem('token');
      }
    } else {
      // No token found, ensure user is logged out
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [fetchUserRole, handleLogout]);

  const handleLogin = async (token: string) => {
    console.log('handleLogin called with token:', token);
    localStorage.setItem('token', token);
    await fetchUserRole();
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <nav className={`bg-white dark:bg-gray-800 shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <span className={`text-xl font-bold text-indigo-600 dark:text-indigo-400`}>Beojji</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {isLoggedIn && (
                  <>
                    <Link to="/classes" className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400`}>
                      Classes
                    </Link>
                    <Link to="/my-submissions" className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400`}>
                      Submissions
                    </Link>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <>
                    <Link to="/my-status" className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400`}>
                      Status
                    </Link>
                    {userRole === 'admin' && (
                      <Link to="/admin" className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400`}>
                        Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400`}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400`}>
                      Login
                    </Link>
                    <Link to="/register" className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400`}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register-success" element={<RegisterSuccessPage />} />
                <Route 
                  path="/login" 
                  element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} 
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
                  path="/classes" 
                  element={isLoggedIn ? <ClassesPage /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/problem/:problemId" 
                  element={isLoggedIn ? <ProblemPage /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/problem/:problemId/submit" 
                  element={isLoggedIn ? <SubmissionPage /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/my-submissions" 
                  element={isLoggedIn ? <MySubmissionsPage /> : <Navigate to="/login" />} 
                />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
      <AppContent />
  );
}

export default App;