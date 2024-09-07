import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { showErrorToast } from '../utils/toastUtils';
import { FaGithub } from 'react-icons/fa';
import Button from './Button'; // Import the Button component

interface ClassProblem {
  id: number;
  problem: {
    id: number;
    title: string;
    description: string;
    link: string;
    readme: string | null;
  };
  class: {
    id: number;
    name: string;
  };
}

const ProblemPage: React.FC = () => {
  const { classProblemId } = useParams<{ classProblemId: string }>();
  const [classProblem, setClassProblem] = useState<ClassProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassProblem = async () => {
      try {
        const response = await axiosInstance.get(`/api/problem/class/${classProblemId}`);
        setClassProblem(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching class problem:', err);
        showErrorToast('Failed to load problem. Please try again later.');
        setLoading(false);
      }
    };

    fetchClassProblem();
  }, [classProblemId]);

  const CodeBlock = ({ language, value }: { language: string, value: string }) => {
    return (
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {value}
      </SyntaxHighlighter>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!classProblem) return <div>Problem not found</div>;

  const { problem, class: courseInfo } = classProblem;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold mr-2">{problem.title}</h1>
            {problem.link && (
              <a 
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ml-2"
                aria-label="View on GitHub"
              >
                <FaGithub size={24} />
              </a>
            )}
          </div>
          <Button 
            to={`/submit/${classProblem.id}`}
            variant="primary"
            size="small"
          >
            Submit Solution
          </Button>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Course: {courseInfo.name}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{problem.description}</p>
      {problem.readme && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">README</h2>
          <ReactMarkdown 
            className="prose dark:prose-invert max-w-none"
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <CodeBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {problem.readme}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;