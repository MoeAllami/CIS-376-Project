"use client";
import { useState } from "react";
import NavBar from "./components/NavBar";
import SortingVisualizer from "./components/SortingVisualizer";
import PathVisualizer from "./components/PathVisualizer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("sorting");

  return (
    <div>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-6">
        {activeTab === "sorting" ? <SortingVisualizer /> : <PathVisualizer />}
      </main>
    </div>
  );
}
