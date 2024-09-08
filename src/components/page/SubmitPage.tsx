import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import Editor from "@monaco-editor/react";
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

interface CourseProblem {
  id: number;
  courseId: number;
  problemId: number;
  dueDate: string;
  course: {
    id: number;
    name: string;
  };
  problem: {
    id: number;
    title: string;
    description: string;
  };
}

const SubmitPage: React.FC = () => {
  const { courseProblemId } = useParams<{ courseProblemId: string }>();
  const navigate = useNavigate();
  const [courseProblem, setCourseProblem] = useState<CourseProblem | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseProblem = async () => {
      try {
        const response = await axiosInstance.get(`problem/course/${courseProblemId}`);
        setCourseProblem(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course problem:', err);
        showErrorToast('Failed to load problem. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourseProblem();
  }, [courseProblemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseProblem) {
      showErrorToast('No course problem found.');
      return;
    }
    try {
      const response = await axiosInstance.post('submission', {
        courseProblemId: courseProblem.id,
        code,
      });
      showSuccessToast(`Submission successful!`);
      navigate(`/problem/${courseProblem.problemId}`);
    } catch (err) {
      console.error('Error submitting code:', err);
      showErrorToast('Failed to submit code. Please try again.');
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!courseProblem) return <div>Problem not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{courseProblem.problem.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{courseProblem.problem.description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Course: {courseProblem.course.name} | Due: {new Date(courseProblem.dueDate).toLocaleString()}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block mb-2 text-gray-700 dark:text-gray-300">Your Code:</label>
          <Editor
            height="400px"
            defaultLanguage="scala" // You can change this based on the problem requirements
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>
        <button type="submit" className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitPage;