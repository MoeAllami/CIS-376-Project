import React from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  return (
    <nav className="bg-gray-900 text-white border-b border-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-3">
        <h2 className="text-xl font-bold text-blue-400">AlgoCanvas</h2>
        <div className="space-x-2">
          <button
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "sorting"
                ? "bg-blue-700 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("sorting")}
          >
            Sorting
          </button>
          <button
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "pathfinding"
                ? "bg-blue-700 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("pathfinding")}
          >
            Pathfinding
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
