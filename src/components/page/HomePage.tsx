import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaCode, FaTrophy, FaGithub } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <main className="flex flex-col items-center w-full px-4 sm:px-12 text-center max-w-4xl mx-auto">
        <img src={require('../../resources/beojji.jpg')} alt="Beojji" className="w-auto h-64 mb-4 object-contain" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 pt-2 pb-4">
          Welcome to Beojji!
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl w-full">
          <Link
            to="/courses"
            className="p-4 flex flex-col items-center justify-center border rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <FaBook className="text-3xl mb-2" />
            <h3 className="text-lg font-bold">Courses</h3>
            <p className="text-sm mt-1">Learn coding</p>
          </Link>

          <Link
            to="/problems"
            className="p-4 flex flex-col items-center justify-center border rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <FaCode className="text-3xl mb-2" />
            <h3 className="text-lg font-bold">Problems</h3>
            <p className="text-sm mt-1">Solve challenges</p>
          </Link>

          <Link
            to="/leaderboard"
            className="p-4 flex flex-col items-center justify-center border rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <FaTrophy className="text-3xl mb-2" />
            <h3 className="text-lg font-bold">Leaderboard</h3>
            <p className="text-sm mt-1">Compare ranks</p>
          </Link>

          <a
            href="https://github.com/kimjg1119/beojji-frontend"
            className="p-4 flex flex-col items-center justify-center border rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <FaGithub className="text-3xl mb-2" />
            <h3 className="text-lg font-bold">GitHub</h3>
            <p className="text-sm mt-1">View source</p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default HomePage;