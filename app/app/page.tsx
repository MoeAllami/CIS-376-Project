"use client";
import { useState } from "react";
import NavBar from "./components/NavBar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("sorting");

  return <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />;
}
