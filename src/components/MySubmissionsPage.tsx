import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { showErrorToast } from '../utils/toastUtils';

interface Submission {
  id: number;
  classProblem: {
    problem: {
      id: number;
      title: string;
    };
    class: {
      id: number;
      name: string;
      courseId: string;
    };
  };
  status: string;
  score: number;
  createdAt: string;
  code: string;
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
        showErrorToast('Failed to load submissions. Please try again later.');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">My Submissions</h1>
      {submissions.length === 0 ? (
        <p>You haven't made any submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">Course ID</th>
                <th className="px-4 py-2 text-left">Problem</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">{submission.classProblem.class.courseId}</td>
                  <td className="px-4 py-2">
                    <Link 
                      to={`/problem/${submission.classProblem.problem.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {submission.classProblem.problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      submission.status === 'ACCEPTED' ? 'bg-green-200 text-green-800' :
                      submission.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{submission.score}</td>
                  <td className="px-4 py-2">{new Date(submission.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySubmissionsPage;