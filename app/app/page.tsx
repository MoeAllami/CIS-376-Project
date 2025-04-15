"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 py-12 space-y-10">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-blue-400 text-center">
        Welcome to AlgoCanvas
      </h1>

      {/* Description */}
      <p className="text-gray-300 text-xl max-w-2xl text-center leading-relaxed">
        Explore and understand algorithms like never before. Visualize how
        sorting and pathfinding algorithms work through interactive animations.
        Dive into an intuitive learning experience designed for developers and
        enthusiasts.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-6">
        <Link href="/sorting">
          <button className="bg-gray-800 text-gray-300 hover:bg-gray-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
            Sorting Visualizer
          </button>
        </Link>
        <Link href="/pathfinding">
          <button className="bg-gray-800 text-gray-300 hover:bg-gray-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
            Pathfinding Visualizer
          </button>
        </Link>
      </div>

      {/* Footer / Signature */}
      <p className="text-sm text-gray-500 pt-8">Created by MIS Dynamics</p>
    </div>
  );
}
