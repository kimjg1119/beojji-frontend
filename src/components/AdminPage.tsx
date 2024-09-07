import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toastUtils';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Class {
  id: number;
  name: string;
  courseId: string;
  term: string;
  description: string;
  link: string;
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
  const [newCourseId, setNewCourseId] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemDescription, setNewProblemDescription] = useState('');
  const [selectedClassesForProblem, setSelectedClassesForProblem] = useState<number[]>([]);
  const [newClassTerm, setNewClassTerm] = useState('');
  const [newClassLink, setNewClassLink] = useState('');
  const [newProblemLink, setNewProblemLink] = useState('');

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
      showErrorToast('Error fetching users');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showErrorToast('Error fetching classes');
    }
  };

  const handleEnroll = async () => {
    if (!selectedUser) {
      showInfoToast('Please select a user');
      return;
    }

    if (selectedClasses.length === 0) {
      showInfoToast('Please select at least one class');
      return;
    }

    try {
      await axiosInstance.post('/api/enrollment/enroll', {
        userId: selectedUser,
        classIds: selectedClasses,
      });
      showSuccessToast('Enrollment successful');
      setSelectedUser(null);
      setSelectedClasses([]);
      fetchUsers();
    } catch (error: any) {
      console.error('Error enrolling user:', error);
      showErrorToast('Enrollment failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleAddClass = async () => {
    if (!newClassName.trim() || !newCourseId.trim() || !newClassTerm.trim()) {
      showInfoToast('Please enter a class name, course ID, and term');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/classes', { 
        name: newClassName,
        courseId: newCourseId,
        term: newClassTerm,
        description: newClassDescription,
        link: newClassLink
      });
      showSuccessToast('Class added successfully');
      setNewClassName('');
      setNewCourseId('');
      setNewClassTerm('');
      setNewClassDescription('');
      setNewClassLink('');
      setClasses([...classes, response.data]);
    } catch (error) {
      console.error('Error adding class:', error);
      showErrorToast('Failed to add class');
    }
  };

  const handleAddProblem = async () => {
    if (!newProblemTitle.trim() || !newProblemDescription.trim() || selectedClassesForProblem.length === 0) {
      showInfoToast('Please fill all required fields and select at least one class for the new problem');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/problems', {
        title: newProblemTitle,
        description: newProblemDescription,
        link: newProblemLink,
        classIds: selectedClassesForProblem,
      });
      showSuccessToast('Problem added successfully');
      setNewProblemTitle('');
      setNewProblemDescription('');
      setNewProblemLink('');
      setSelectedClassesForProblem([]);
      fetchClasses();
    } catch (error) {
      console.error('Error adding problem:', error);
      showErrorToast('Failed to add problem');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 text-foreground">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-12 bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Enroll User</h2>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Select User:</label>
          <select
            className="w-full p-2 border rounded bg-background text-foreground"
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
          <label className="block mb-2 text-foreground">Select Classes:</label>
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
              <label htmlFor={`class-${cls.id}`} className="text-foreground">{cls.name}</label>
            </div>
          ))}
        </div>
        <button
          onClick={handleEnroll}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          disabled={!selectedUser || selectedClasses.length === 0}
        >
          Enroll User
        </button>
      </div>

      <div className="mb-12 bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Class</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="w-full p-2 border rounded mb-2 bg-background text-foreground"
          />
          <input
            type="text"
            value={newCourseId}
            onChange={(e) => setNewCourseId(e.target.value)}
            placeholder="Enter course ID"
            className="w-full p-2 border rounded mb-2 bg-background text-foreground"
          />
          <input
            type="text"
            value={newClassTerm}
            onChange={(e) => setNewClassTerm(e.target.value)}
            placeholder="Enter term (e.g., Fall 2023)"
            className="w-full p-2 border rounded mb-2 bg-background text-foreground"
          />
          <textarea
            value={newClassDescription}
            onChange={(e) => setNewClassDescription(e.target.value)}
            placeholder="Enter class description"
            className="w-full p-2 border rounded mb-2 bg-background text-foreground"
            rows={3}
          />
          <input
            type="text"
            value={newClassLink}
            onChange={(e) => setNewClassLink(e.target.value)}
            placeholder="Enter class link (optional)"
            className="w-full p-2 border rounded mb-2 bg-background text-foreground"
          />
        </div>
        <button
          onClick={handleAddClass}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          Add Class
        </button>
      </div>

      <div className="mt-12 bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Problem</h2>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Problem Title:</label>
          <input
            type="text"
            value={newProblemTitle}
            onChange={(e) => setNewProblemTitle(e.target.value)}
            placeholder="Enter problem title"
            className="w-full p-2 border rounded bg-background text-foreground"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Problem Description:</label>
          <textarea
            value={newProblemDescription}
            onChange={(e) => setNewProblemDescription(e.target.value)}
            placeholder="Enter problem description"
            className="w-full p-2 border rounded bg-background text-foreground"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Problem Link (optional):</label>
          <input
            type="text"
            value={newProblemLink}
            onChange={(e) => setNewProblemLink(e.target.value)}
            placeholder="Enter problem link"
            className="w-full p-2 border rounded bg-background text-foreground"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-foreground">Select Classes:</label>
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
              <label htmlFor={`problem-class-${cls.id}`} className="text-foreground">{cls.name}</label>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddProblem}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          Add Problem
        </button>
      </div>
    </div>
  );
};

export default AdminPage;