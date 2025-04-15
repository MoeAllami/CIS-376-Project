"use client";
import NavBar from "./NavBar";

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
