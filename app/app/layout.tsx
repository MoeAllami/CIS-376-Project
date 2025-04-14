// This is the root layout file for the entire app
// It defines the HTML structure, global styles, and wraps all routes with LayoutWrapper

import './globals.css';
import React from 'react';
import LayoutWrapper from './components/LayoutWrapper';

// Page metadata (used for <head> tags like title and description)
export const metadata = {
  title: 'AlgoCanvas',
  description: 'Interactive algorithm visualizer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        {/* LayoutWrapper conditionally shows NavBar and renders page content */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
