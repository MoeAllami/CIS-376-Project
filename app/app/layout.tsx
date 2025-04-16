import "./globals.css";
import React from "react";
import LayoutWrapper from "./components/LayoutWrapper";
import SessionWrapper from "./components/SessionWrapper";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "AlgoCanvas",
  description: "Interactive algorithm visualizer",
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
          <NavBar />
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
