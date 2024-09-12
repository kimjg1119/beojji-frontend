import React from "react";
import Link from "next/link";
import { FaBook, FaCode, FaTrophy, FaGithub } from "react-icons/fa";
import Image from "next/image";
import beojji404 from "@/public/beojji404.png";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <main className="flex flex-col items-center w-full px-4 sm:px-12 text-center max-w-4xl mx-auto">
        <Image
          className="w-fit h-fit mb-4 object-cover"
          loading="eager"
          src={beojji404}
          alt="Picture of cat named Beojji"
          placeholder="blur"
        />
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 pt-2 pb-4">
          Beojji ran away!!
        </h1>

        <h1 className="text-sm sm:text-lg font-bold mb-6 pt-2 pb-4">
          There is no page to show. (404)
        </h1>
      </main>
    </div>
  );
}
