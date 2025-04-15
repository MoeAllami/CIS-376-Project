import './globals.css';
import React from 'react';
import LayoutWrapper from './components/LayoutWrapper';
import SessionWrapper from './components/SessionWrapper';

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
        <SessionWrapper>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
