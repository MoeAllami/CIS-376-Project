'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const NavBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-800 shadow-md w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl font-bold text-blue-400 hover:underline">
            AlgoCanvas
          </Link>
        </div>

        {/* Center: Navigation Buttons */}
        <div className="flex gap-2">
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

        {/* Right: Auth Controls */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-300">
                Signed in as <span className="font-medium">{session.user?.email}</span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
