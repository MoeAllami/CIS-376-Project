// This component wraps all pages with optional NavBar
// It uses usePathname() to determine the current route
// NavBar is only shown when not on the homepage ("/")

'use client';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = pathname !== '/'; // Hide NavBar on homepage

  return (
    <>
      {showNav && <NavBar />}
      <main>{children}</main>
    </>
  );
}
