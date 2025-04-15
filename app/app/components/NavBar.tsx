"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NavBar = () => {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();

  const navButton = (active: boolean) =>
    `px-4 py-2 rounded-md transition ${
      active
        ? "bg-blue-700 text-white"
        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
    }`;

  const hiddenNavPaths = ["/", "/auth/signin", "/auth/register"];
  const showNavButtons = !hiddenNavPaths.includes(pathname);

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-800 shadow-md w-full relative h-[4.5rem]">
      <div className="max-w-7xl mx-auto w-full h-full px-6 relative flex items-center justify-center">
        {/* Left: Logo */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <Link
            href="/"
            className="text-xl font-bold text-blue-400 hover:underline"
          >
            AlgoCanvas
          </Link>
        </div>

        {/* Center: Sorting / Pathfinding */}
        {showNavButtons && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <Link href="/sorting">
              <button className={navButton(pathname === "/sorting")}>
                Sorting
              </button>
            </Link>
            <Link href="/pathfinding">
              <button className={navButton(pathname === "/pathfinding")}>
                Pathfinding
              </button>
            </Link>
          </div>
        )}

        {/* Right: Auth Controls */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-300">
                {" "}
                <span className="font-medium">{session.user?.email}</span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded-md transition bg-gray-800 text-gray-300 hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className={navButton(pathname === "/auth/signin")}>
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className={navButton(pathname === "/auth/register")}>
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
