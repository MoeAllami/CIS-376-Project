"use client";
import { useState } from "react";
import NavBar from "./components/NavBar";
import SortingVisualizer from "./components/SortingVisualizer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("sorting");

  return (
    <div>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-6">
        {activeTab === "sorting" ? <SortingVisualizer /> : null}
      </main>
    </div>
  );
}
