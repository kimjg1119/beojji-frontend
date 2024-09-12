"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaBook, FaCode, FaTrophy, FaGithub } from "react-icons/fa";
import Image from "next/image";
import beojji from "@/public/beojji.jpg";
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function Home() {
  const [confettiProps, setConfettiProps] = useState({
    run: true,
    recycle: true,
    numberOfPieces: 200,
    opacity: 1,
  });
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fadeOutDuration = 3000; // 3 seconds for fade out
    const totalDuration = 6000; // 6 seconds total

    const fadeOutInterval = setInterval(() => {
      setConfettiProps(prev => ({
        ...prev,
        numberOfPieces: Math.max(0, prev.numberOfPieces - 1),
        opacity: Math.max(0, prev.opacity - 0.01),
      }));
    }, fadeOutDuration / 100);

    const timer = setTimeout(() => {
      clearInterval(fadeOutInterval);
      setConfettiProps(prev => ({ ...prev, run: false }));
    }, totalDuration);

    const updateWindowDimensions = () => {
      setWindowDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };

    window.addEventListener('resize', updateWindowDimensions);
    updateWindowDimensions();

    return () => {
      clearTimeout(timer);
      clearInterval(fadeOutInterval);
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <ReactConfetti
        {...windowDimensions}
        numberOfPieces={confettiProps.numberOfPieces}
        opacity={confettiProps.opacity}
        run={confettiProps.run}
        recycle={confettiProps.recycle}
      />
      <main className="flex flex-col items-center w-full px-4 sm:px-12 text-center max-w-4xl mx-auto">
        <Image
          className="w-fit h-fit mb-4 object-cover"
          loading="eager"
          src={beojji}
          alt="Picture of cat named Beojji"
          placeholder="blur"
        />
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 pt-2 pb-4">
          Welcome to Beojji!
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl w-full">
          <Link
            href="/courses"
            className="p-4 flex flex-col items-center justify-center border rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <FaBook className="text-3xl mb-2" />
            <h3 className="text-lg font-bold">Courses</h3>
            <p className="text-sm mt-1">Learn coding</p>
          </Link>

          <Link
            href="/problems"
            className="p-4 flex flex-col items-center justify-center border rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <FaCode className="text-3xl mb-2" />
            <h3 className="text-lg font-bold">Problems</h3>
            <p className="text-sm mt-1">Solve challenges</p>
          </Link>

          <Link
            href="/leaderboard"
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
}
