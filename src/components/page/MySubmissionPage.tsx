import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { showErrorToast } from '../../utils/toastUtils';

interface Submission {
  id: number;
  courseProblem: {
    problem: {
      id: number;
      title: string;
    };
    course: {
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

const MySubmissionPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('submission/my');
        setSubmissions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        showErrorToast('Failed to load submissions');
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="my-submissions-page">
      <h1 className="text-2xl font-bold mb-4">My Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-center">ID</th>
              <th className="px-4 py-2 text-center">Course ID</th>
              <th className="px-4 py-2 text-center">Problem</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Score</th>
              <th className="px-4 py-2 text-center">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-center">{submission.id}</td>
                <td className="px-4 py-2 text-center">{submission.courseProblem.course.courseId}</td>
                <td className="px-4 py-2 text-center">
                  <Link 
                    to={`/problem/${submission.courseProblem.problem.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {submission.courseProblem.problem.title}
                  </Link>
                </td>
                <td className="px-4 py-2 text-center">
                  <Link
                    to={`/submission/${submission.id}`}
                    className={`px-2 py-1 rounded inline-flex items-center ${
                      submission.status === 'ACCEPTED' ? 'bg-green-200 text-green-800' :
                      submission.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {submission.status}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </td>
                <td className="px-4 py-2 text-center">{submission.status !== 'PENDING' ? submission.score : '-'}</td>
                <td className="px-4 py-2 text-center">{new Date(submission.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySubmissionPage;
