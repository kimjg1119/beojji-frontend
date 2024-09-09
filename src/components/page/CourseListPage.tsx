import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import AssignmentCard from '../card/AssignmentCard';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface Problem {
  id: number;
  title: string;
  description: string;
  link: string;
}

interface CourseProblem {
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
  courseProblem: CourseProblem[];
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  console.log(course);
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-s text-gray-500">{course.term}</p>
            <h3 className="text-2xl font-semibold">{course.courseId} | {course.name}</h3>
            <p className="text-sm text-muted-foreground">
              {course.courseProblem.length} problem{course.courseProblem.length !== 1 ? 's' : ''}
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
        {course.courseProblem.map((courseProblem, index) => (
          courseProblem.problem ? (
            <AssignmentCard
              key={courseProblem.id}
              classProblemId={courseProblem.id}
              idx={index}
              title={courseProblem.problem.title}
              description={courseProblem.problem.description}
              dueDate={courseProblem.dueDate}
              link={courseProblem.problem.link}
              opened={new Date(courseProblem.dueDate) > new Date()}
            />
          ) : (
            <div key={courseProblem.id} className="text-red-500">Problem data is missing for assignment {index + 1}</div>
          )
        ))}
      </div>
    </div>
  );
};

const CourseListPage: React.FC = () => {
  const [courses, setCourse] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get('course/me'); 
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourse();
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