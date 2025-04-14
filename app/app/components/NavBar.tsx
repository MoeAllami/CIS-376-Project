'use client'; // Enables client-side features like hooks (usePathname)

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Used to highlight the active route

const NavBar = () => {
  // Get the current route 
  const pathname = usePathname();

  return (
    // Main navigation bar container
    <nav className="bg-gray-900 text-white border-b border-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-3">
        {/* Logo / Brand - clickable link back to home page */}
        <Link href="/" className="text-xl font-bold text-blue-400 hover:underline">
          AlgoCanvas
        </Link>

        {/* Navigation buttons */}
        <div className="space-x-2">
          {/* Sorting Button */}
          <Link href="/sorting">
            <button
              className={`px-4 py-2 rounded-md transition ${
                pathname === '/sorting'
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Sorting
            </button>
          </Link>

          {/* Pathfinding Button */}
          <Link href="/pathfinding">
            <button
              className={`px-4 py-2 rounded-md transition ${
                pathname === '/pathfinding'
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Pathfinding
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
