"use client";
import NavBar from "./NavBar";

interface Props {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: Props) {
  return <main className="max-w-7xl mx-auto px-6 w-full">{children}</main>;
}
