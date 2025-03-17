import { useState, useEffect, useRef } from "react";

type CellType = "empty" | "wall" | "start" | "goal" | "path" | "visited";
type Algorithm = "a-star" | "dfs";
type Tool = "wall" | "start" | "goal" | "eraser";

interface Position {
  row: number;
  col: number;
}

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
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<Algorithm>("a-star");
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  // Add refs to track animation state
  const animationInProgress = useRef(false);
  const animationTimeouts = useRef<number[]>([]);

  // Default positions
  const defaultStart = { row: 5, col: 5 };
  const defaultGoal = { row: 15, col: 25 };

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  // Initialize grid with empty cells
  const initializeGrid = () => {
    // Stop any running animations first
    stopAnimations();
    setIsVisualizing(false);

    const newGrid: CellType[][] = [];
    for (let row = 0; row < rows; row++) {
      const currentRow: CellType[] = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push("empty");
      }
      newGrid.push(currentRow);
    }

    // Set start and goal positions
    newGrid[defaultStart.row][defaultStart.col] = "start";
    newGrid[defaultGoal.row][defaultGoal.col] = "goal";

    setGrid(newGrid);
    setStartPosition(defaultStart);
    setGoalPosition(defaultGoal);
  };

  // Function to stop all animations
  const stopAnimations = () => {
    animationInProgress.current = false;
    // Clear all timeouts
    animationTimeouts.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId)
    );
    animationTimeouts.current = [];
  };

  // update cells when mouse is pressed
  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizing) return; // Prevent changes during visualization
    setIsMousePressed(true);
    updateCell(row, col);
  };

  // update cells when mouse is pressed and moved
  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isVisualizing) return;
    updateCell(row, col);
  };

  // update cells when mouse is released
  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  // Update cell based on selected tool
  const updateCell = (row: number, col: number) => {
    const newGrid = [...grid];
    const currentCell = newGrid[row][col];

    // Don't allow changing start or goal positions when in wall mode
    if (
      (currentCell === "start" && selectedTool !== "start") ||
      (currentCell === "goal" && selectedTool !== "goal")
    ) {
      return;
    }

    // Update for different tools
    switch (selectedTool) {
      case "wall":
        if (currentCell !== "start" && currentCell !== "goal") {
          newGrid[row][col] = currentCell === "wall" ? "empty" : "wall";
        }
        break;
      case "start":
        // Don't place start on a wall or goal
        if (currentCell === "wall" || currentCell === "goal") return;
        // Remove previous start
        newGrid[startPosition.row][startPosition.col] = "empty";
        newGrid[row][col] = "start";
        setStartPosition({ row, col });
        break;
      case "goal":
        // Don't place goal on a wall or start
        if (currentCell === "wall" || currentCell === "start") return;
        // Remove previous goal
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
  };

  // Modified resetVisualization function
  const resetVisualization = () => {
    // Stop any ongoing animations
    stopAnimations();
    setIsVisualizing(false);

    // Reset to default positions and clear paths
    const newGrid = [...grid];

    // First clear all visited and path cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (newGrid[row][col] === "path" || newGrid[row][col] === "visited") {
          newGrid[row][col] = "empty";
        }
      }
    }

    // Clear existing start and goal positions
    if (
      startPosition.row >= 0 &&
      startPosition.row < rows &&
      startPosition.col >= 0 &&
      startPosition.col < cols
    ) {
      newGrid[startPosition.row][startPosition.col] = "empty";
    }

    if (
      goalPosition.row >= 0 &&
      goalPosition.row < rows &&
      goalPosition.col >= 0 &&
      goalPosition.col < cols
    ) {
      newGrid[goalPosition.row][goalPosition.col] = "empty";
    }

    // Set new start and goal positions
    newGrid[defaultStart.row][defaultStart.col] = "start";
    newGrid[defaultGoal.row][defaultGoal.col] = "goal";

    setStartPosition(defaultStart);
    setGoalPosition(defaultGoal);
    setGrid(newGrid);
  };

  // Visualize the selected algorithm
  const visualize = async () => {
    // Don't start a new visualization if one is already in progress
    if (isVisualizing) return;

    // Clear previous paths/visited cells but keep walls
    const newGrid = [...grid];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (newGrid[row][col] === "path" || newGrid[row][col] === "visited") {
          newGrid[row][col] = "empty";
        }
      }
    }
    setGrid(newGrid);

    setIsVisualizing(true);
    animationInProgress.current = true;

    let pathFound = false;
    if (selectedAlgorithm === "a-star") {
      pathFound = await visualizeAStar();
    } else {
      pathFound = await visualizeDFS();
    }

    if (animationInProgress.current) {
      setIsVisualizing(false);
      // Optionally show a message if no path was found
      if (!pathFound) {
        alert("No path found!");
      }
    }
  };

  // Modified delay function to track timeouts
  const delay = (ms: number) => {
    return new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(() => {
        resolve();
      }, ms);
      animationTimeouts.current.push(timeoutId);
    });
  };

  // A* algorithm implementation
  const visualizeAStar = async () => {
    const newGrid = [...grid];

    // Using a priority queue would be ideal, but we'll simulate one with an array
    // and proper sorting
    const openSet: { position: Position; fScore: number }[] = [
      {
        position: startPosition,
        fScore: heuristic(startPosition, goalPosition),
      },
    ];

    const closedSet: Set<string> = new Set();
    const gScore: Map<string, number> = new Map();
    const cameFrom: Map<string, Position> = new Map();

    // Initialize start position
    gScore.set(`${startPosition.row},${startPosition.col}`, 0);

    let iterations = 0;
    const maxIterations = rows * cols * 2; // Safeguard against infinite loops

    while (openSet.length > 0 && animationInProgress.current) {
      iterations++;
      if (iterations > maxIterations) {
        console.log("A* exceeded maximum iterations");
        return false;
      }

      // Sort the open set by fScore
      openSet.sort((a, b) => a.fScore - b.fScore);

      // Get the node with lowest fScore
      const current = openSet.shift()!.position;
      const currentKey = `${current.row},${current.col}`;

      // Goal check
      if (
        current.row === goalPosition.row &&
        current.col === goalPosition.col
      ) {
        await reconstructPath(cameFrom, goalPosition);
        return true;
      }

      // Add to closed set
      closedSet.add(currentKey);

      // Mark as visited (except start/goal)
      if (
        newGrid[current.row][current.col] !== "start" &&
        newGrid[current.row][current.col] !== "goal" &&
        animationInProgress.current
      ) {
        newGrid[current.row][current.col] = "visited";
        setGrid([...newGrid]);
        await delay(20);
      }

      // Get neighbors
      const neighbors = getNeighbors(current, newGrid);

      // Process each neighbor
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;

        // Skip if already evaluated
        if (closedSet.has(neighborKey)) continue;

        // Calculate tentative gScore
        const tentativeGScore = (gScore.get(currentKey) || 0) + 1;

        // Check if this is a better path
        const existingGScore = gScore.get(neighborKey) || Infinity;

        if (tentativeGScore < existingGScore) {
          // This is a better path - record it
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeGScore);

          const newFScore =
            tentativeGScore + heuristic(neighbor, goalPosition) * 2; // Increase heuristic weight

          // Check if neighbor is already in openSet
          const existingIndex = openSet.findIndex(
            (item) =>
              item.position.row === neighbor.row &&
              item.position.col === neighbor.col
          );

          if (existingIndex !== -1) {
            // Update existing entry
            openSet[existingIndex].fScore = newFScore;
          } else {
            // Add new entry
            openSet.push({ position: neighbor, fScore: newFScore });
          }
        }
      }
    }

    // No path found
    return false;
  };

  // DFS algorithm implementation
  const visualizeDFS = async () => {
    const newGrid = [...grid];
    const stack: Position[] = [{ ...startPosition }];
    const visited: Set<string> = new Set();
    const cameFrom: Map<string, Position> = new Map();

    let iterations = 0;
    const maxIterations = rows * cols * 2; // Safeguard against infinite loops

    // Start DFS: keep going until stack is empty
    while (stack.length > 0 && animationInProgress.current) {
      iterations++;
      if (iterations > maxIterations) {
        console.log("DFS exceeded maximum iterations");
        return false;
      }

      // Get the most recently added position (LIFO - Last In First Out)
      const current = stack.pop()!;
      const currentKey = `${current.row},${current.col}`;

      // Skip if already visited
      if (visited.has(currentKey)) continue;

      // Mark as visited
      visited.add(currentKey);

      // Goal check
      if (
        current.row === goalPosition.row &&
        current.col === goalPosition.col
      ) {
        await reconstructPath(cameFrom, goalPosition);
        return true;
      }

      // Mark as visited in the grid (except start/goal)
      if (
        newGrid[current.row][current.col] !== "start" &&
        newGrid[current.row][current.col] !== "goal" &&
        animationInProgress.current
      ) {
        newGrid[current.row][current.col] = "visited";
        setGrid([...newGrid]);
        await delay(20);
      }

      // Get neighbors in a specific order: right, down, left, up
      // This ensures that DFS explores in a consistent direction pattern
      const neighbors = getNeighborsInOrder(current, newGrid);

      // Add neighbors to stack in reverse order (so the preferred direction gets popped first)
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        const neighborKey = `${neighbor.row},${neighbor.col}`;

        if (!visited.has(neighborKey)) {
          stack.push(neighbor);
          cameFrom.set(neighborKey, current);
        }
      }
    }

    // No path found
    return false;
  };

  // Get neighbors in a specific order: right, down, left, up
  const getNeighborsInOrder = (position: Position, grid: CellType[][]) => {
    const { row, col } = position;
    const neighbors: Position[] = [];

    // Define directions in order of preference
    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0], // up
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== "wall"
      ) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  };

  const getNeighbors = (position: Position, grid: CellType[][]) => {
    const { row, col } = position;
    const neighbors: Position[] = [];
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== "wall"
      ) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  };

  // Modified heuristic with stronger influence
  const heuristic = (a: Position, b: Position) => {
    // Euclidean distance but with a stronger weight
    return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
  };

  // Reconstruct path from start to goal
  const reconstructPath = async (
    cameFrom: Map<string, Position>,
    current: Position
  ) => {
    if (!animationInProgress.current) return [];

    const newGrid = [...grid];
    const path: Position[] = [];
    let currentPos = current;

    // Reconstruct path from end to start
    while (true) {
      path.unshift(currentPos);

      const currentKey = `${currentPos.row},${currentPos.col}`;
      if (!cameFrom.has(currentKey)) break;

      // Move to previous position
      currentPos = cameFrom.get(currentKey)!;

      // Safety check to prevent infinite loops
      if (path.length > rows * cols) {
        console.error("Path reconstruction exceeded maximum length");
        break;
      }
    }

    // Visualize the path
    for (let i = 0; i < path.length; i++) {
      if (!animationInProgress.current) return path;

      const { row, col } = path[i];
      if (
        row >= 0 &&
        row < rows &&
        col >= 0 &&
        col < cols &&
        newGrid[row][col] !== "start" &&
        newGrid[row][col] !== "goal"
      ) {
        newGrid[row][col] = "path";
        setGrid([...newGrid]);
        await delay(50);
      }
    }

    return path;
  };

  const getCellColor = (cell: CellType) => {
    switch (cell) {
      case "wall":
        return "bg-gray-800";
      case "start":
        return "bg-green-500";
      case "goal":
        return "bg-red-500";
      case "path":
        return "bg-yellow-400";
      case "visited":
        return "bg-blue-300";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Pathfinding Visualizer</h1>

      <div className="flex flex-wrap space-x-4 mb-4">
        <div className="flex space-x-2 mb-2">
          <button
            className={`px-3 py-1 rounded ${
              selectedTool === "wall" ? "bg-blue-600 text-white" : "bg-gray-200"
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
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedTool("start")}
            disabled={isVisualizing}
          >
            Start
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedTool === "goal" ? "bg-blue-600 text-white" : "bg-gray-200"
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
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedTool("eraser")}
            disabled={isVisualizing}
          >
            Eraser
          </button>
        </div>

        <select
          className="px-3 py-1 border rounded mb-2"
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value as Algorithm)}
          disabled={isVisualizing}
        >
          <option value="a-star">A* Algorithm</option>
          <option value="dfs">DFS Algorithm</option>
        </select>

        <button
          className="px-3 py-1 bg-green-500 text-white rounded disabled:bg-gray-400 mb-2"
          onClick={visualize}
          disabled={isVisualizing}
        >
          {isVisualizing ? "Visualizing..." : "Visualize!"}
        </button>

        <button
          className="px-3 py-1 bg-red-500 text-white rounded mb-2"
          onClick={resetVisualization}
        >
          Reset
        </button>

        <button
          className="px-3 py-1 bg-gray-500 text-white rounded mb-2"
          onClick={initializeGrid}
        >
          Clear All
        </button>
      </div>

      <div
        className="grid grid-cols-1 gap-0 border border-gray-300"
        onMouseLeave={handleMouseUp}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-6 h-6 border border-gray-200 ${getCellColor(
                  cell
                )}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center space-x-4 mt-2 text-sm">
        <div className="flex items-center m-1">
          <div className="w-4 h-4 bg-green-500 mr-1"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center m-1">
          <div className="w-4 h-4 bg-red-500 mr-1"></div>
          <span>Goal</span>
        </div>
        <div className="flex items-center m-1">
          <div className="w-4 h-4 bg-gray-800 mr-1"></div>
          <span>Wall</span>
        </div>
        <div className="flex items-center m-1">
          <div className="w-4 h-4 bg-blue-300 mr-1"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center m-1">
          <div className="w-4 h-4 bg-yellow-400 mr-1"></div>
          <span>Path</span>
        </div>
      </div>
    </div>
  );
};

export default PathVisualizer;
