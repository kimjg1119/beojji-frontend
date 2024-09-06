import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface UserStatus {
  email: string;
  name: string;
  studentId: string;
  role: string;
}

const MyStatus: React.FC = () => {
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(response.data);
      } catch (error) {
        console.error('Error fetching user status:', error);
        if (axios.isAxiosError(error)) {
          console.error('Error response:', error.response?.data);
          setError(`Failed to fetch user status: ${error.response?.data?.message || error.message}`);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    fetchStatus();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Status</h2>
      <p><strong>Name:</strong> {status.name}</p>
      <p><strong>Email:</strong> {status.email}</p>
      <p><strong>Student ID:</strong> {status.studentId}</p>
      <p><strong>Role:</strong> {status.role}</p>
    </div>
  );
};

export default MyStatus;