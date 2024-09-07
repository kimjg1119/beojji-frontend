import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to Beojji
        </h1>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link
            to="/courses"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Courses &rarr;</h3>
            <p className="mt-4 text-xl">
              Explore our coding courses and start learning!
            </p>
          </Link>

          <Link
            to="/problems"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Problems &rarr;</h3>
            <p className="mt-4 text-xl">
              Challenge yourself with our coding problems!
            </p>
          </Link>

          <Link
            to="/leaderboard"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Leaderboard &rarr;</h3>
            <p className="mt-4 text-xl">
              See how you rank among other coders!
            </p>
          </Link>

          <a
            href="https://github.com/your-repo/beojji"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">GitHub &rarr;</h3>
            <p className="mt-4 text-xl">
              Check out our source code and contribute!
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://github.com/your-repo/beojji"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <FaGithub className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
};

export default HomePage;