import React from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import Button from "../basic/Button"; // Import the Button component

interface AssignmentCardProps {
  classProblemId: number;
  idx: number;
  title: string;
  description: string;
  dueDate: string;
  opened: boolean;
  classTitle?: string;
  link?: string;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  classProblemId,
  idx,
  title,
  description,
  opened,
  dueDate,
  link,
}) => {
  return (
    <div className="flex items-center">
      <p className="text-xl text-[#666] mr-4">#{idx + 1}</p>
      <div className="flex-grow">
        <p className="text-xl font-bold flex items-center gap-2">
          <Link
            href={`/problem/${classProblemId}`}
            className="hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FaGithub />
            </a>
          )}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Due: {new Date(dueDate).toLocaleString()}
        </p>
      </div>
      <div className="ml-4">
        {opened ? (
          <Button
            to={`/submit/${classProblemId}`}
            variant="primary"
            size="small"
          >
            Submit
          </Button>
        ) : (
          <Button variant="secondary" size="small" disabled>
            Closed
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
