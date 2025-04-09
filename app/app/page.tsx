"use client";
import { useState } from "react";
import NavBar from "./components/NavBar";
import SortingVisualizer from "./components/SortingVisualizer";
import PathVisualizer from "./components/PathVisualizer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("sorting");

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        {activeTab === "sorting" ? <SortingVisualizer /> : <PathVisualizer />}
      </main>
    </div>
  );
}
