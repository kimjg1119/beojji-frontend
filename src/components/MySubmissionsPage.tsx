import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

interface Submission {
  id: number;
  problemId: number;
  problemTitle: string;
  code: string;
  status: string;
  createdAt: string;
}

const MySubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get('/api/submissions/my');
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions. Please try again later.');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">My Submissions</h1>
      {submissions.length === 0 ? (
        <p>You haven't made any submissions yet.</p>
      ) : (
        <ul className="space-y-6">
          {submissions.map((submission) => (
            <li key={submission.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <Link 
                  to={`/problem/${submission.problemId}`}
                  className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {submission.problemTitle}
                </Link>
                <span className={`px-2 py-1 rounded ${
                  submission.status === 'ACCEPTED' ? 'bg-green-200 text-green-800' :
                  submission.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {submission.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Submitted on: {new Date(submission.createdAt).toLocaleString()}
              </p>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
                <code>{submission.code}</code>
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySubmissionsPage;