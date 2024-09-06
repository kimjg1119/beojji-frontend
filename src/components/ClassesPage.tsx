import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

interface Problem {
  id: number;
  title: string;
  description: string;
}

interface Class {
  id: number;
  name: string;
  problems: Problem[];
}

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get('/api/users/me/classes');
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">My Classes</h1>
      {classes.length === 0 ? (
        <p>You are not enrolled in any classes.</p>
      ) : (
        <ul className="space-y-8">
          {classes.map((cls) => (
            <li key={cls.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">{cls.name}</h2>
              {cls.problems.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Problems:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {cls.problems.map((problem) => (
                      <li key={problem.id}>
                        <Link 
                          to={`/problem/${problem.id}`} 
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {problem.title}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{problem.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No problems assigned to this class yet.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassesPage;