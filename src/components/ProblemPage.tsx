import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

interface Problem {
  id: number;
  title: string;
  description: string;
  classes: { id: number; name: string }[];
}

const ProblemPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosInstance.get(`/api/problems/${problemId}`);
        setProblem(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to load problem. Please try again later.');
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{problem.description}</p>
      <Link 
        to={`/problem/${problem.id}/submit`}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Solution
      </Link>
    </div>
  );
};

export default ProblemPage;