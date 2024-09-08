import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { showErrorToast } from '../../utils/toastUtils';
import { FaGithub } from 'react-icons/fa';
import Button from '../basic/Button'; // Import the Button component

interface CourseProblem {
  id: number;
  problem: {
    id: number;
    title: string;
    description: string;
    link: string;
    readme: string | null;
  };
  course: {
    id: number;
    name: string;
  };
}

const SpinningLoader: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const ProblemPage: React.FC = () => {
  const { courseProblemId } = useParams<{ courseProblemId: string }>();
  const [courseProblem, setCourseProblem] = useState<CourseProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseProblem = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`problem/course/${courseProblemId}`);
        setCourseProblem(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching class problem:', err);
        showErrorToast('Failed to load problem. Please try again later.');
        setLoading(false);
        setReadmeLoading(false);
      }
    };

    fetchCourseProblem();
  }, [courseProblemId]);

  const CodeBlock = ({ language, value }: { language: string, value: string }) => {
    return (
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {value}
      </SyntaxHighlighter>
    );
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto mt-10">
      <SpinningLoader />
      <p className="text-center mt-4">Loading problem...</p>
    </div>
  );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!courseProblem) return <div>Problem not found</div>;

  const { problem, course: courseInfo } = courseProblem;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Upper part */}
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold mr-2 dark:text-white">{problem.title}</h1>
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
            to={`/submit/${courseProblem.id}`}
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

      {/* README part */}
      {problem.readme && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">README</h2>
          {readmeLoading ? (
            <SpinningLoader />
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemPage;