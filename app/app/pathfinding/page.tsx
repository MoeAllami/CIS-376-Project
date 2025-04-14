'use client';
import { useState, useEffect, useRef } from "react";
import {
  CellType,
  Position,
} from "@/utils/PathingAlgorithms";

type Algorithm = "a-star" | "dfs" | "bfs" | "greedy";
type Tool = "wall" | "start" | "goal" | "eraser";
type AnimationStep = CellType[][];

const PathVisualizer = () => {
  const rows = 20;
  const cols = 30;
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [startPosition, setStartPosition] = useState<Position>({
    row: 5,
    col: 5,
  });
  const [goalPosition, setGoalPosition] = useState<Position>({
    row: 15,
    col: 25,
  });
  const [selectedTool, setSelectedTool] = useState<Tool>("wall");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("a-star");
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);

  // Animation states
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(100); // milliseconds
  const [algorithmStepsGenerated, setAlgorithmStepsGenerated] = useState(false);

  // Animation refs
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default positions
  const defaultStart = { row: 5, col: 5 };
  const defaultGoal = { row: 15, col: 25 };

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  // Animation playback effect
  useEffect(() => {
    if (!isPlaying || currentStepIndex >= animationSteps.length - 1) {
      if (
        currentStepIndex >= animationSteps.length - 1 &&
        animationSteps.length > 0
      ) {
        setIsPlaying(false);
      }
      return;
    }

    playbackTimeoutRef.current = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
      setGrid([...animationSteps[currentStepIndex + 1]]);
    }, animationSpeed);

    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, animationSteps, animationSpeed]);

  // Initialize grid with empty cells
  const initializeGrid = () => {
    stopAnimation();
    setIsVisualizing(false);
    setAlgorithmStepsGenerated(false);
    setAnimationSteps([]);
    setCurrentStepIndex(0);

    const newGrid: CellType[][] = [];
    for (let row = 0; row < rows; row++) {
      const currentRow: CellType[] = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push("empty");
      }
      newGrid.push(currentRow);
    }

    newGrid[defaultStart.row][defaultStart.col] = "start";
    newGrid[defaultGoal.row][defaultGoal.col] = "goal";

    setGrid(newGrid);
    setStartPosition(defaultStart);
    setGoalPosition(defaultGoal);
  };

  // Stop the animation
  const stopAnimation = () => {
    setIsPlaying(false);
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
  };

  // Cell update logic
  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizing) return;
    setIsMousePressed(true);
    updateCell(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isVisualizing) return;
    updateCell(row, col);
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const updateCell = (row: number, col: number) => {
    const newGrid = [...grid];
    const currentCell = newGrid[row][col];

    if (
      (currentCell === "start" && selectedTool !== "start") ||
      (currentCell === "goal" && selectedTool !== "goal")
    ) {
      return;
    }

    switch (selectedTool) {
      case "wall":
        if (currentCell !== "start" && currentCell !== "goal") {
          newGrid[row][col] = currentCell === "wall" ? "empty" : "wall";
        }
        break;
      case "start":
        if (currentCell === "wall" || currentCell === "goal") return;
        newGrid[startPosition.row][startPosition.col] = "empty";
        newGrid[row][col] = "start";
        setStartPosition({ row, col });
        break;
      case "goal":
        if (currentCell === "wall" || currentCell === "start") return;
        newGrid[goalPosition.row][goalPosition.col] = "empty";
        newGrid[row][col] = "goal";
        setGoalPosition({ row, col });
        break;
      case "eraser":
        if (currentCell !== "start" && currentCell !== "goal") {
          newGrid[row][col] = "empty";
        }
        break;
    }

    setGrid(newGrid);
    if (algorithmStepsGenerated) {
      setAlgorithmStepsGenerated(false);
      setAnimationSteps([]);
      setCurrentStepIndex(0);
    }
  };

  // Reset visualization
  const resetVisualization = () => {
    stopAnimation();
    setIsVisualizing(false);
    setAlgorithmStepsGenerated(false);
    setAnimationSteps([]);
    setCurrentStepIndex(0);

    const newGrid = [...grid];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (["path", "visited", "current", "frontier"].includes(newGrid[row][col])) {
          newGrid[row][col] = "empty";
        }
      }
    }

    setGrid(newGrid);
  };

  // Fetch animation steps from server-side and start visualization
  const visualize = async () => {
    if (isVisualizing) return;

    stopAnimation();

    const newGrid = [...grid];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (["path", "visited", "current"].includes(newGrid[row][col])) {
          newGrid[row][col] = "empty";
        }
      }
    }
    setGrid(newGrid);
    setIsVisualizing(true);

    try {
      const response = await fetch('/api/path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: selectedAlgorithm,
          grid,
          startPosition,
          goalPosition,
          rows,
          cols,
        })
      });

      if (!response.ok) throw new Error("Failed to fetch path data");

      const result = await response.json();
      const { steps, pathFound } = result;

      setAnimationSteps(steps);
      setAlgorithmStepsGenerated(true);

      if (steps.length > 0) {
        setCurrentStepIndex(0);
        setGrid([...steps[0]]);
        setIsPlaying(true);
      }

      if (!pathFound && steps.length > 0) {
        setTimeout(() => alert("No path found!"), 100);
      }
    } catch (err) {
      console.error("Error fetching path data:", err);
      alert("Failed to generate path. Please try again.");
      setIsVisualizing(false);
    }
  };

  // Playback controls
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const stepForward = (steps: number = 1) => {
    const newIndex = Math.min(currentStepIndex + steps, animationSteps.length - 1);
    setCurrentStepIndex(newIndex);
    setGrid([...animationSteps[newIndex]]);
  };

  const stepBackward = (steps: number = 1) => {
    const newIndex = Math.max(currentStepIndex - steps, 0);
    setCurrentStepIndex(newIndex);
    setGrid([...animationSteps[newIndex]]);
  };

  const jumpToStart = () => {
    setCurrentStepIndex(0);
    setGrid([...animationSteps[0]]);
    setIsPlaying(false);
  };

  const jumpToEnd = () => {
    const lastIndex = animationSteps.length - 1;
    setCurrentStepIndex(lastIndex);
    setGrid([...animationSteps[lastIndex]]);
    setIsPlaying(false);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationSpeed(600 - parseInt(e.target.value));
  };

  const getCellColor = (cell: CellType) => {
    switch (cell) {
      case "wall": return "bg-gray-700";
      case "start": return "bg-green-500";
      case "goal": return "bg-red-500";
      case "path": return "bg-yellow-500";
      case "visited": return "bg-blue-700";
      case "current": return "bg-purple-600";
      case "frontier": return "bg-red-400";
      default: return "bg-gray-900";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold text-center py-3 text-blue-400">
        Pathfinding Visualizer
      </h1>

      {/* Controls Panel - Moved to top */}
      <div className="flex flex-col space-y-2 px-4 mb-3">
        <div className="flex flex-wrap justify-between gap-2 mb-1">
          <div className="flex flex-wrap gap-1">
            <button
              className={`px-3 py-1 rounded ${
                selectedTool === "wall"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedTool("wall")}
              disabled={isVisualizing}
            >
              Wall
            </button>
            <button
              className={`px-3 py-1 rounded ${
                selectedTool === "start"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedTool("start")}
              disabled={isVisualizing}
            >
              Start
            </button>
            <button
              className={`px-3 py-1 rounded ${
                selectedTool === "goal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedTool("goal")}
              disabled={isVisualizing}
            >
              Goal
            </button>
            <button
              className={`px-3 py-1 rounded ${
                selectedTool === "eraser"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedTool("eraser")}
              disabled={isVisualizing}
            >
              Eraser
            </button>
          </div>

          <div className="flex flex-wrap gap-1">
            <select
              className="px-3 py-1 bg-gray-800 text-gray-200 border border-gray-700 rounded"
              value={selectedAlgorithm}
              onChange={(e) =>
                setSelectedAlgorithm(e.target.value as Algorithm)
              }
              disabled={isVisualizing && !algorithmStepsGenerated}
            >
              <option value="a-star">A* Algorithm</option>
              <option value="greedy">Greedy Best-First Search</option>
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
            </select>

            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600"
              onClick={visualize}
              disabled={isVisualizing && !algorithmStepsGenerated}
            >
              {isVisualizing && !algorithmStepsGenerated
                ? "Generating..."
                : "Visualize!"}
            </button>

            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={resetVisualization}
            >
              Reset
            </button>

            <button
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={initializeGrid}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Legend - Moved to top */}
        <div className="flex flex-wrap justify-center gap-3 mt-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 mr-1"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-1"></div>
            <span>Goal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-700 mr-1"></div>
            <span>Wall</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-700 mr-1"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-600 mr-1"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
            <span>Path</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 mr-1"></div>
            <span>Frontier</span>
          </div>
        </div>
      </div>

      {/* Animation Controls - Keep with the grid */}
      {algorithmStepsGenerated && animationSteps.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-1 p-2 mx-4 mb-2 bg-gray-800 rounded">
          <button
            onClick={jumpToStart}
            className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            ⏮️ Start
          </button>
          <button
            onClick={() => stepBackward(5)}
            className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            ⏪ -5
          </button>
          <button
            onClick={() => stepBackward(1)}
            className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            ◀️
          </button>
          {isPlaying ? (
            <button
              onClick={togglePlayPause}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ⏸️
            </button>
          ) : (
            <button
              onClick={togglePlayPause}
              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ▶️
            </button>
          )}
          <button
            onClick={() => stepForward(1)}
            className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            ▶️
          </button>
          <button
            onClick={() => stepForward(5)}
            className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            ⏩ +5
          </button>
          <button
            onClick={jumpToEnd}
            className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            ⏭️ End
          </button>

          <div className="flex items-center ml-2">
            <span className="mr-2 text-sm">Speed:</span>
            <input
              type="range"
              min="100"
              max="500"
              value={600 - animationSpeed}
              onChange={handleSpeedChange}
              className="w-24 accent-blue-600"
            />
          </div>

          <div className="ml-2 text-sm">
            Step: {currentStepIndex + 1} / {animationSteps.length}
          </div>
        </div>
      )}

      {/* Grid Visualization - Now below the controls */}
      <div className="grid grid-cols-1 flex-grow overflow-hidden border border-gray-700 mx-4 mb-4">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-grow">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`border border-gray-800 ${getCellColor(cell)}`}
                style={{ width: "100%", height: "100%" }}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default PathVisualizer;
