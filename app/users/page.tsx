import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("users"); // Updated API path
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-2xl mx-auto border border-gray-200 dark:border-gray-700`}
    >
      <h2 className={`text-3xl font-bold mb-6 text-gray-800 dark:text-white`}>
        User List
      </h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow transition duration-300 ease-in-out hover:shadow-lg`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span
                  className={`font-semibold text-lg text-gray-800 dark:text-white`}
                >
                  {user.name || "Unnamed"}
                </span>
                <p className={`text-gray-600 dark:text-gray-300 text-sm`}>
                  {user.email}
                </p>
                <p
                  className={`text-indigo-600 dark:text-indigo-400 text-sm font-medium`}
                >
                  Role: {user.role}
                </p>
              </div>
              <span className={`text-gray-500 dark:text-gray-400 text-sm`}>
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
