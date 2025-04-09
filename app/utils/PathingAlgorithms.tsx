// utils/PathAlgorithmsUtils.tsx
export type CellType =
  | "empty"
  | "wall"
  | "start"
  | "goal"
  | "path"
  | "visited"
  | "current";
export type AnimationStep = CellType[][];

export interface Position {
  row: number;
  col: number;
}

export interface PathResult {
  steps: AnimationStep[];
  pathFound: boolean;
}

// Helper functions
export const getNeighborsInOrder = (
  position: Position,
  grid: CellType[][],
  rows: number,
  cols: number
): Position[] => {
  const { row, col } = position;
  const neighbors: Position[] = [];

  // Define directions in order of preference: right, down, left, up
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

export const getNeighbors = (
  position: Position,
  grid: CellType[][],
  rows: number,
  cols: number
): Position[] => {
  const { row, col } = position;
  const neighbors: Position[] = [];

  // Define directions: up, down, left, right
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

export const heuristic = (a: Position, b: Position): number => {
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
};

/**
 * Reconstructs the shortest path from start to goal using the cameFrom map
 * and creates animation steps for visualizing this path.
 *
 * Note: The shortest path is guaranteed for BFS and Dijkstra's algorithm.
 * For A*, it's the shortest if the heuristic is admissible.
 * For DFS and Greedy, there's no guarantee of a shortest path.
 */
export const reconstructPathSteps = (
  cameFrom: Map<string, Position>,
  goalPosition: Position,
  baseGrid: CellType[][],
  rows: number,
  cols: number
): AnimationStep[] => {
  const pathSteps: AnimationStep[] = [];
  const shortestPath: Position[] = [];
  let currentPos = { ...goalPosition };

  // Check if we have a valid path to reconstruct
  if (cameFrom.size === 0) {
    return pathSteps; // Return empty array if no path exists
  }

  // Trace back from goal to start using the cameFrom map
  // This gives us the shortest path for algorithms that guarantee it (A*, BFS, Dijkstra's)
  while (true) {
    shortestPath.unshift(currentPos); // Add to front of path

    const currentKey = `${currentPos.row},${currentPos.col}`;
    if (!cameFrom.has(currentKey)) {
      // We've reached the start position or a disconnected point
      break;
    }

    // Move to previous position in the shortest path
    currentPos = cameFrom.get(currentKey)!;

    // Safety check to prevent infinite loops
    if (shortestPath.length > rows * cols) {
      console.error("Path reconstruction exceeded maximum length");
      break;
    }
  }

  // Create a deep copy of the base grid to start with
  let currentGrid = JSON.parse(JSON.stringify(baseGrid));

  // Reset any "current" markers to "visited" in the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (currentGrid[row][col] === "current") {
        currentGrid[row][col] = "visited";
      }
    }
  }

  // Generate animation steps for the path visualization
  // We'll add cells to the path one by one from start to goal
  for (let i = 0; i < shortestPath.length; i++) {
    const { row, col } = shortestPath[i];

    // Create a new grid state for each step
    const newGrid = JSON.parse(JSON.stringify(currentGrid));

    // Only mark as path if it's not start or goal
    if (newGrid[row][col] !== "start" && newGrid[row][col] !== "goal") {
      newGrid[row][col] = "path";
    }

    pathSteps.push(newGrid);
    currentGrid = newGrid;
  }

  return pathSteps;
};

// A* Algorithm
export const computeAStarSteps = (
  grid: CellType[][],
  startPosition: Position,
  goalPosition: Position,
  rows: number,
  cols: number
): PathResult => {
  const steps: AnimationStep[] = [];
  const initialGrid = JSON.parse(JSON.stringify(grid));
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
    if (current.row === goalPosition.row && current.col === goalPosition.col) {
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
    const neighbors = getNeighbors(current, initialGrid, rows, cols);

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
      steps[steps.length - 1],
      rows,
      cols
    );
    steps.push(...pathSteps);
  }

  return { steps, pathFound };
};

// DFS Algorithm
export const computeDFSSteps = (
  grid: CellType[][],
  startPosition: Position,
  goalPosition: Position,
  rows: number,
  cols: number
): PathResult => {
  const steps: AnimationStep[] = [];
  const initialGrid = JSON.parse(JSON.stringify(grid));
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
    if (current.row === goalPosition.row && current.col === goalPosition.col) {
      pathFound = true;
      break;
    }

    // Get neighbors in a specific order
    const neighbors = getNeighborsInOrder(current, initialGrid, rows, cols);

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
      steps[steps.length - 1],
      rows,
      cols
    );
    steps.push(...pathSteps);
  }

  return { steps, pathFound };
};
