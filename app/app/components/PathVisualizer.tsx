import { useState, useEffect, useRef } from "react";

type CellType =
  | "empty"
  | "wall"
  | "start"
  | "goal"
  | "path"
  | "visited"
  | "current";
type Algorithm = "a-star" | "dfs";
type Tool = "wall" | "start" | "goal" | "eraser";
type AnimationStep = CellType[][];

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
    // Clear any running animations
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

    // Set start and goal positions
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

    // Reset animation state when grid changes
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

    // Reset to default positions and clear paths
    const newGrid = [...grid];

    // First clear all visited and path cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (
          newGrid[row][col] === "path" ||
          newGrid[row][col] === "visited" ||
          newGrid[row][col] === "current"
        ) {
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

  // Start visualization process
  const visualize = async () => {
    if (isVisualizing) return;

    // Stop any running animations first
    stopAnimation();

    // Clear previous paths/visited cells
    const newGrid = [...grid];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (
          newGrid[row][col] === "path" ||
          newGrid[row][col] === "visited" ||
          newGrid[row][col] === "current"
        ) {
          newGrid[row][col] = "empty";
        }
      }
    }
    setGrid(newGrid);

    setIsVisualizing(true);

    // Generate all animation steps
    let steps: AnimationStep[] = [];
    let pathFound = false;

    if (selectedAlgorithm === "a-star") {
      [steps, pathFound] = await generateAStarSteps();
    } else {
      [steps, pathFound] = await generateDFSSteps();
    }

    setAnimationSteps(steps);
    setAlgorithmStepsGenerated(true);

    if (steps.length > 0) {
      setCurrentStepIndex(0);
      setGrid([...steps[0]]);
      setIsPlaying(true);
    }

    if (!pathFound && steps.length > 0) {
      // We still show the animation even if no path was found
      setTimeout(() => {
        alert("No path found!");
      }, 100);
    }
  };

  // Generate all steps for A* algorithm without animation
  const generateAStarSteps = async (): Promise<[AnimationStep[], boolean]> => {
    const steps: AnimationStep[] = [];
    const initialGrid = [...grid];
    steps.push(JSON.parse(JSON.stringify(initialGrid))); // Save initial state

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
    let pathFound = false;

    while (openSet.length > 0) {
      iterations++;
      if (iterations > maxIterations) {
        console.log("A* exceeded maximum iterations");
        break;
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
        pathFound = true;
        // We'll reconstruct the path after this loop
        break;
      }

      // Add to closed set
      closedSet.add(currentKey);

      // Create new state for this step
      const newGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

      // Mark as visited and current (except start/goal)
      if (
        newGrid[current.row][current.col] !== "start" &&
        newGrid[current.row][current.col] !== "goal"
      ) {
        newGrid[current.row][current.col] = "visited";
      }

      // Add current position marker
      if (
        newGrid[current.row][current.col] !== "start" &&
        newGrid[current.row][current.col] !== "goal"
      ) {
        newGrid[current.row][current.col] = "current";
      }

      steps.push(newGrid);

      // Get neighbors
      const neighbors = getNeighbors(current, initialGrid);

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
            tentativeGScore + heuristic(neighbor, goalPosition) * 2;

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

    // If path was found, reconstruct it
    if (pathFound) {
      // We need to add more steps to show the path reconstruction
      const pathSteps = reconstructPathSteps(
        cameFrom,
        goalPosition,
        steps[steps.length - 1]
      );
      steps.push(...pathSteps);
    }

    return [steps, pathFound];
  };

  // Generate all steps for DFS algorithm without animation
  const generateDFSSteps = async (): Promise<[AnimationStep[], boolean]> => {
    const steps: AnimationStep[] = [];
    const initialGrid = [...grid];
    steps.push(JSON.parse(JSON.stringify(initialGrid))); // Save initial state

    const stack: Position[] = [{ ...startPosition }];
    const visited: Set<string> = new Set();
    const cameFrom: Map<string, Position> = new Map();

    let iterations = 0;
    const maxIterations = rows * cols * 2; // Safeguard against infinite loops
    let pathFound = false;

    // Start DFS: keep going until stack is empty
    while (stack.length > 0) {
      iterations++;
      if (iterations > maxIterations) {
        console.log("DFS exceeded maximum iterations");
        break;
      }

      // Get the most recently added position (LIFO - Last In First Out)
      const current = stack.pop()!;
      const currentKey = `${current.row},${current.col}`;

      // Skip if already visited
      if (visited.has(currentKey)) continue;

      // Mark as visited
      visited.add(currentKey);

      // Create new state for this step
      const newGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

      // Mark as visited (except start/goal)
      if (
        newGrid[current.row][current.col] !== "start" &&
        newGrid[current.row][current.col] !== "goal"
      ) {
        newGrid[current.row][current.col] = "visited";
      }

      // Mark current cell
      if (
        newGrid[current.row][current.col] !== "start" &&
        newGrid[current.row][current.col] !== "goal"
      ) {
        newGrid[current.row][current.col] = "current";
      }

      steps.push(newGrid);

      // Goal check
      if (
        current.row === goalPosition.row &&
        current.col === goalPosition.col
      ) {
        pathFound = true;
        break;
      }

      // Get neighbors in a specific order
      const neighbors = getNeighborsInOrder(current, initialGrid);

      // Add neighbors to stack in reverse order
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        const neighborKey = `${neighbor.row},${neighbor.col}`;

        if (!visited.has(neighborKey)) {
          stack.push(neighbor);
          cameFrom.set(neighborKey, current);
        }
      }
    }

    // If path was found, reconstruct it
    if (pathFound) {
      const pathSteps = reconstructPathSteps(
        cameFrom,
        goalPosition,
        steps[steps.length - 1]
      );
      steps.push(...pathSteps);
    }

    return [steps, pathFound];
  };

  // Generate steps for path reconstruction
  const reconstructPathSteps = (
    cameFrom: Map<string, Position>,
    current: Position,
    baseGrid: CellType[][]
  ): AnimationStep[] => {
    const pathSteps: AnimationStep[] = [];
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

    // Generate steps for the path visualization
    let currentGrid = JSON.parse(JSON.stringify(baseGrid));

    // Reset any "current" markers to "visited"
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (currentGrid[row][col] === "current") {
          currentGrid[row][col] = "visited";
        }
      }
    }

    for (let i = 0; i < path.length; i++) {
      const { row, col } = path[i];

      // Create a new grid state for each step
      const newGrid = JSON.parse(JSON.stringify(currentGrid));

      if (newGrid[row][col] !== "start" && newGrid[row][col] !== "goal") {
        newGrid[row][col] = "path";
      }

      pathSteps.push(newGrid);
      currentGrid = newGrid;
    }

    return pathSteps;
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

  const heuristic = (a: Position, b: Position) => {
    return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
  };

  // Playback controls
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const stepForward = (steps: number = 1) => {
    if (currentStepIndex + steps < animationSteps.length) {
      const newIndex = currentStepIndex + steps;
      setCurrentStepIndex(newIndex);
      setGrid([...animationSteps[newIndex]]);
    } else {
      // Jump to last step
      const lastIndex = animationSteps.length - 1;
      setCurrentStepIndex(lastIndex);
      setGrid([...animationSteps[lastIndex]]);
    }
  };

  const stepBackward = (steps: number = 1) => {
    if (currentStepIndex - steps >= 0) {
      const newIndex = currentStepIndex - steps;
      setCurrentStepIndex(newIndex);
      setGrid([...animationSteps[newIndex]]);
    } else {
      // Jump to first step
      setCurrentStepIndex(0);
      setGrid([...animationSteps[0]]);
    }
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
    // Lower value = faster animation
    setAnimationSpeed(600 - parseInt(e.target.value));
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
      case "current":
        return "bg-purple-500";
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
          disabled={isVisualizing && !algorithmStepsGenerated}
        >
          <option value="a-star">A* Algorithm</option>
          <option value="dfs">DFS Algorithm</option>
        </select>

        <button
          className="px-3 py-1 bg-green-500 text-white rounded disabled:bg-gray-400 mb-2"
          onClick={visualize}
          disabled={isVisualizing && !algorithmStepsGenerated}
        >
          {isVisualizing && !algorithmStepsGenerated
            ? "Generating..."
            : "Visualize!"}
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

      {/* Animation Controls - only shown when algorithm steps are generated */}
      {algorithmStepsGenerated && animationSteps.length > 0 && (
        <div className="mb-4 flex flex-wrap justify-center items-center gap-2">
          <button
            onClick={jumpToStart}
            className="px-2 py-1 bg-purple-500 text-white rounded"
          >
            ⏮️ Start
          </button>
          <button
            onClick={() => stepBackward(5)}
            className="px-2 py-1 bg-purple-500 text-white rounded"
          >
            ⏪ -5 Steps
          </button>
          <button
            onClick={() => stepBackward(1)}
            className="px-2 py-1 bg-purple-500 text-white rounded"
          >
            ◀️ Step Back
          </button>
          {isPlaying ? (
            <button
              onClick={togglePlayPause}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              ⏸️ Pause
            </button>
          ) : (
            <button
              onClick={togglePlayPause}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              ▶️ Play
            </button>
          )}
          <button
            onClick={() => stepForward(1)}
            className="px-2 py-1 bg-purple-500 text-white rounded"
          >
            ▶️ Step Forward
          </button>
          <button
            onClick={() => stepForward(5)}
            className="px-2 py-1 bg-purple-500 text-white rounded"
          >
            ⏩ +5 Steps
          </button>
          <button
            onClick={jumpToEnd}
            className="px-2 py-1 bg-purple-500 text-white rounded"
          >
            ⏭️ End
          </button>

          <div className="flex items-center ml-2">
            <span className="mr-2">Speed:</span>
            <input
              type="range"
              min="100"
              max="500"
              value={600 - animationSpeed}
              onChange={handleSpeedChange}
              className="w-32"
            />
          </div>

          <div className="ml-2">
            Step: {currentStepIndex + 1} / {animationSteps.length}
          </div>
        </div>
      )}

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
          <div className="w-4 h-4 bg-purple-500 mr-1"></div>
          <span>Current</span>
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
