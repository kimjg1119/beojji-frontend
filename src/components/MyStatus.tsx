import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

interface UserStatus {
  name: string;
  email: string;
  studentId: string;
  role: string;
}

const MyStatus: React.FC = () => {
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/users/me');
        setStatus(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user status:', err);
        setError('Failed to load user status. Please try again later.');
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!status) return <div>No status information available.</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-foreground">My Status</h2>
      <div className="bg-card shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">Name:</label>
          <p className="text-foreground">{status.name}</p>
        </div>
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">Email:</label>
          <p className="text-foreground">{status.email}</p>
        </div>
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">Student ID:</label>
          <p className="text-foreground">{status.studentId}</p>
        </div>
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">Role:</label>
          <p className="text-foreground">{status.role}</p>
        </div>
      </div>
    </div>
  );
};

export default MyStatus;