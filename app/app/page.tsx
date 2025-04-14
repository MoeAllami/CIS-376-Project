// This is the landing page (route: "/")
// It shows a welcome message and navigation buttons to the visualizer pages

'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      {/* Centered Card */}
      <div className="bg-gray-800 rounded-xl shadow-xl px-10 py-12 max-w-2xl text-center space-y-6 w-full">
        {/* Title */}
        <h1 className="text-4xl font-bold text-blue-400">Welcome to AlgoCanvas</h1>

        {/* Description */}
        <p className="text-gray-300 text-lg">
          Explore and understand algorithms like never before.  
          Visualize how sorting and pathfinding algorithms work through interactive animations.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/sorting">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition">
              Sorting Visualizer
            </button>
          </Link>
          <Link href="/pathfinding">
            <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-medium transition">
              Pathfinding Visualizer
            </button>
          </Link>
        </div>
      </div>

      {/* Footer / Signature */}
      <p className="mt-6 text-sm text-gray-500">Created by MIS Dynamics</p>
    </div>
  );
}
