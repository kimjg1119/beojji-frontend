"use client";

import { apiMyCourse } from "@/lib/api";
import { use, useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import AssignmentCard from "@/components/card/AssignmentCard";
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-s text-gray-500">{course.term}</p>
            <h3 className="text-2xl font-semibold">
              {course.courseId} | {course.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {course.courseProblem.length} problem
              {course.courseProblem.length !== 1 ? "s" : ""}
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
          <p className="text-sm text-muted-foreground mt-2">
            {course.description}
          </p>
        )}
      </div>
      <div className="px-6 pb-6 space-y-4">
        <h4 className="text-lg font-semibold">Assignments:</h4>
        {course.courseProblem.map((courseProblem, index) =>
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
            <div key={courseProblem.id} className="text-red-500">
              Problem data is missing for assignment {index + 1}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default function CourseListPage() {
  const courses = use(apiMyCourse({}));
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts for 5 seconds

    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateWindowDimensions);
    updateWindowDimensions();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
        />
      )}
      <h1 className="text-4xl font-bold mb-8 text-center">My Courses</h1>
      {courses.length === 0 ? (
        <p className="text-center text-muted-foreground">
          You are not enrolled in any courses.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {courses.map((course) => (
            <CourseCard key={course.courseId} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}