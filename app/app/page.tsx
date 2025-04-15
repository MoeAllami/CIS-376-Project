"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-6 py-12">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-10">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-blue-400">
          Welcome to AlgoCanvas
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-xl leading-relaxed">
          Explore and understand algorithms like never before. Visualize how
          sorting and pathfinding algorithms work through interactive
          animations. Dive into an intuitive learning experience designed for
          developers and enthusiasts.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6 w-full">
          <Link href="/sorting" className="w-full sm:w-auto">
            <button className="w-full sm:w-64 bg-gray-800 text-gray-300 hover:bg-gray-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
              Sorting Visualizer
            </button>
          </Link>
          <Link href="/pathfinding" className="w-full sm:w-auto">
            <button className="w-full sm:w-64 bg-gray-800 text-gray-300 hover:bg-gray-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
              Pathfinding Visualizer
            </button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500">Created by MIS Dynamics</p>
      </div>
    </div>
  );
}
