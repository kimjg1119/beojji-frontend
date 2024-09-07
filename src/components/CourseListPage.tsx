import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import AssignmentCard from './AssignmentCard';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { showErrorToast } from '../utils/toastUtils';

interface Problem {
  id: number;
  title: string;
  description: string;
  link: string;
}

interface ClassProblem {
  id: number;
  problem: Problem;
  dueDate: string;
}

interface Course {
  id: number;
  name: string;
  courseId: string;
  term: string;
  description: string;
  link: string;
  problems: ClassProblem[];
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-s text-gray-500">{course.term}</p>
            <h3 className="text-2xl font-semibold">{course.courseId} | {course.name}</h3>
            <p className="text-sm text-muted-foreground">
              {course.problems.length} problem{course.problems.length !== 1 ? 's' : ''}
            </p>
          </div>
          <a 
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View Course
            <FaExternalLinkAlt className="ml-2 h-4 w-4" />
          </a>
        </div>
        {course.description && (
          <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
        )}
     </div>
      <div className="px-6 pb-6 space-y-4">
        <h4 className="text-lg font-semibold">Assignments:</h4>
        {course.problems.map((classProblem, index) => (
          classProblem.problem ? (
            <AssignmentCard
              key={classProblem.id}
              classProblemId={classProblem.id}
              idx={index}
              title={classProblem.problem.title}
              description={classProblem.problem.description}
              dueDate={classProblem.dueDate}
              link={classProblem.problem.link}
              opened={true}
            />
          ) : (
            <div key={classProblem.id} className="text-red-500">Problem data is missing for assignment {index + 1}</div>
          )
        ))}
      </div>
    </div>
  );
};

const CourseListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/users/me/classes');
        console.log('API Response:', response.data); // Add this line for debugging
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Courses</h1>
      {courses.length === 0 ? (
        <p className="text-center text-muted-foreground">You are not enrolled in any courses.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseListPage;