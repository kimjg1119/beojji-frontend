import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios'; // Use the custom axios instance

interface User {
  id: number;
  name: string;
  email: string;
}

interface Class {
  id: number;
  name: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  classId: number;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemDescription, setNewProblemDescription] = useState('');
  const [selectedClassForProblem, setSelectedClassForProblem] = useState<number | null>(null);
  const [selectedClassesForProblem, setSelectedClassesForProblem] = useState<number[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchClasses();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users', 'error');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showNotification('Error fetching classes', 'error');
    }
  };

  const handleEnroll = async () => {
    if (!selectedUser) {
      showNotification('Please select a user', 'error');
      return;
    }

    if (selectedClasses.length === 0) {
      showNotification('Please select at least one class', 'error');
      return;
    }

    try {
      await axiosInstance.post('/api/enrollment/enroll', {
        userId: selectedUser,
        classIds: selectedClasses,
      });
      showNotification('Enrollment successful', 'success');
      setSelectedUser(null);
      setSelectedClasses([]);
      fetchUsers();
    } catch (error: any) {
      console.error('Error enrolling user:', error);
      showNotification('Enrollment failed: ' + (error.response?.data?.message || error.message || 'Unknown error'), 'error');
    }
  };

  const handleAddClass = async () => {
    if (!newClassName.trim()) {
      showNotification('Please enter a class name', 'error');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/classes', { name: newClassName });
      showNotification('Class added successfully', 'success');
      setNewClassName('');
      setClasses([...classes, response.data]);
    } catch (error) {
      console.error('Error adding class:', error);
      showNotification('Failed to add class', 'error');
    }
  };

  const handleAddProblem = async () => {
    if (!newProblemTitle.trim() || !newProblemDescription.trim() || selectedClassesForProblem.length === 0) {
      showNotification('Please fill all fields and select at least one class for the new problem', 'error');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/problems', {
        title: newProblemTitle,
        description: newProblemDescription,
        classIds: selectedClassesForProblem,
      });
      showNotification('Problem added successfully', 'success');
      setNewProblemTitle('');
      setNewProblemDescription('');
      setSelectedClassesForProblem([]);
      // Optionally, refresh the classes to show the new problem
      fetchClasses();
    } catch (error) {
      console.error('Error adding problem:', error);
      showNotification('Failed to add problem', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 30000); // 30 seconds
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {notification && (
        <div className={`mb-4 p-2 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Enroll User</h2>
        <div className="mb-4">
          <label className="block mb-2">Select User:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Select Classes:</label>
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`class-${cls.id}`}
                checked={selectedClasses.includes(cls.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedClasses([...selectedClasses, cls.id]);
                  } else {
                    setSelectedClasses(selectedClasses.filter((id) => id !== cls.id));
                  }
                }}
                className="mr-2"
              />
              <label htmlFor={`class-${cls.id}`}>{cls.name}</label>
            </div>
          ))}
        </div>
        <button
          onClick={handleEnroll}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!selectedUser || selectedClasses.length === 0}
        >
          Enroll User
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Add New Class</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddClass}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Class
        </button>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Add New Problem</h2>
        <div className="mb-4">
          <label className="block mb-2">Problem Title:</label>
          <input
            type="text"
            value={newProblemTitle}
            onChange={(e) => setNewProblemTitle(e.target.value)}
            placeholder="Enter problem title"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Problem Description:</label>
          <textarea
            value={newProblemDescription}
            onChange={(e) => setNewProblemDescription(e.target.value)}
            placeholder="Enter problem description"
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Select Classes:</label>
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`problem-class-${cls.id}`}
                checked={selectedClassesForProblem.includes(cls.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedClassesForProblem([...selectedClassesForProblem, cls.id]);
                  } else {
                    setSelectedClassesForProblem(selectedClassesForProblem.filter(id => id !== cls.id));
                  }
                }}
                className="mr-2"
              />
              <label htmlFor={`problem-class-${cls.id}`}>{cls.name}</label>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddProblem}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Problem
        </button>
      </div>
    </div>
  );
};

export default AdminPage;