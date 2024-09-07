import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
interface Submission {
  id: number;
  code: string;
  status: string;
  createdAt: string;
  classProblem: {
    problem: {
      id: number;
      title: string;
    };
    class: {
      id: number;
      name: string;
      courseId: number;
    };
  };
}

const SubmissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = false; // You should replace this with your actual dark mode logic

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axiosInstance.get(`/api/submissions/${id}`);
        setSubmission(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch submission');
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!submission) return <div className="text-center">Submission not found</div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <FaCheckCircle className="text-green-500" />;
      case 'REJECTED':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaHourglassHalf className="text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Submission Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Problem</h2>
          <Link 
            to={`/problem/${submission.classProblem.problem.id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {submission.classProblem.problem.title}
          </Link>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Class</h2>
          <p className="text-gray-600 dark:text-gray-400">{submission.classProblem.class.name}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Status</h2>
          <div className="flex items-center">
            {getStatusIcon(submission.status)}
            <span className="ml-2 text-gray-600 dark:text-gray-400">{submission.status}</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Submitted at</h2>
          <p className="text-gray-600 dark:text-gray-400">{new Date(submission.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Submitted Code</h2>
          <div
            onClick={() => {
              const blob = new Blob([submission.code], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `submission_${submission.id}.scala`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="cursor-pointer"
            title="Download Code"
            style={{ transform: 'translateY(5px)' }}
          >
            <svg className="w-6 h-6 text-blue-500 hover:text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
        <code className="text-sm text-gray-800 dark:text-gray-200">
          <SyntaxHighlighter language="scala" style={dark}>
            {submission.code}
          </SyntaxHighlighter>
        </code>
      </div>
    </div>
  );
};

export default SubmissionPage;