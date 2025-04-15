// This component wraps all pages with optional NavBar
// It uses usePathname() to determine the current route
// NavBar is only shown when not on the homepage ("/")

'use client';
import NavBar from './NavBar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {<NavBar />}
      <main>{children}</main>
    </>
  );
}
