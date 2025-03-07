import React from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  return (
    <nav className="bg-black-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-xl font-bold">Visualize</h2>
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "sorting" ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("sorting")}
          >
            Sorting Algorithms
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "pathfinding" ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("pathfinding")}
          >
            Pathfinding Algorithms
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
