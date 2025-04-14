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

  // Modified to track complete path for each node
  const openSet: { position: Position; fScore: number; path: Position[] }[] = [
    {
      position: startPosition,
      fScore: heuristic(startPosition, goalPosition),
      path: [startPosition],
    },
  ];

  const closedSet: Set<string> = new Set();
  const gScore: Map<string, number> = new Map();

  // Initialize start position
  gScore.set(`${startPosition.row},${startPosition.col}`, 0);

  let iterations = 0;
  const maxIterations = rows * cols * 2; // Safeguard against infinite loops
  let pathFound = false;
  let finalPath: Position[] = [];

  while (openSet.length > 0) {
    iterations++;
    if (iterations > maxIterations) {
      console.log("A* exceeded maximum iterations");
      break;
    }

    // Sort the open set by fScore
    openSet.sort((a, b) => a.fScore - b.fScore);

    // Get the node with lowest fScore
    const current = openSet.shift()!;
    const currentPos = current.position;
    const currentPath = current.path;
    const currentKey = `${currentPos.row},${currentPos.col}`;

    // Skip if already evaluated
    if (closedSet.has(currentKey)) continue;

    // Create new state for this step - FIRST mark as CURRENT
    const currentGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

    // Mark as current (except start/goal)
    if (
      currentGrid[currentPos.row][currentPos.col] !== "start" &&
      currentGrid[currentPos.row][currentPos.col] !== "goal"
    ) {
      currentGrid[currentPos.row][currentPos.col] = "current";
      steps.push(currentGrid);
    }

    // Goal check
    if (
      currentPos.row === goalPosition.row &&
      currentPos.col === goalPosition.col
    ) {
      pathFound = true;
      finalPath = currentPath;
      break;
    }

    // Add to closed set
    closedSet.add(currentKey);

    // Create new state for this step - THEN mark as VISITED
    const visitedGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

    // Mark as visited (except start/goal)
    if (
      visitedGrid[currentPos.row][currentPos.col] !== "start" &&
      visitedGrid[currentPos.row][currentPos.col] !== "goal"
    ) {
      visitedGrid[currentPos.row][currentPos.col] = "visited";
      steps.push(visitedGrid);
    }

    // Get neighbors
    const neighbors = getNeighbors(currentPos, initialGrid, rows, cols);

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
        gScore.set(neighborKey, tentativeGScore);

        const newFScore =
          tentativeGScore + heuristic(neighbor, goalPosition) * 2;

        // Create the new path by appending the neighbor to the current path
        const newPath = [...currentPath, neighbor];

        // Check if neighbor is already in openSet
        const existingIndex = openSet.findIndex(
          (item) =>
            item.position.row === neighbor.row &&
            item.position.col === neighbor.col
        );

        if (existingIndex !== -1) {
          // Update existing entry
          openSet[existingIndex].fScore = newFScore;
          openSet[existingIndex].path = newPath;
        } else {
          // Add new entry
          openSet.push({
            position: neighbor,
            fScore: newFScore,
            path: newPath,
          });
        }
      }
    }
  }

  // If path was found, visualize it directly
  if (pathFound && finalPath.length > 0) {
    // Skip start and end positions
    for (let i = 1; i < finalPath.length - 1; i++) {
      const { row, col } = finalPath[i];

      // Create a new grid state for this step
      const pathGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

      // Mark as path if not start or goal
      if (pathGrid[row][col] !== "start" && pathGrid[row][col] !== "goal") {
        pathGrid[row][col] = "path";
      }

      steps.push(pathGrid);
    }
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

  // Modified to track complete path for each node
  const stack: [Position, Position[]][] = [[startPosition, [startPosition]]];
  const visited: Set<string> = new Set();

  let iterations = 0;
  const maxIterations = rows * cols * 2; // Safeguard against infinite loops
  let pathFound = false;
  let finalPath: Position[] = [];

  // Start DFS: keep going until stack is empty
  while (stack.length > 0) {
    iterations++;
    if (iterations > maxIterations) {
      console.log("DFS exceeded maximum iterations");
      break;
    }

    // Get the most recently added position and its path (LIFO - Last In First Out)
    const [current, currentPath] = stack.pop()!;
    const currentKey = `${current.row},${current.col}`;

    // Skip if already visited
    if (visited.has(currentKey)) continue;

    // Create new state for this step - FIRST mark as CURRENT
    const currentGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

    // Mark as current (except start/goal)
    if (
      currentGrid[current.row][current.col] !== "start" &&
      currentGrid[current.row][current.col] !== "goal"
    ) {
      currentGrid[current.row][current.col] = "current";
      steps.push(currentGrid);
    }

    // Goal check
    if (current.row === goalPosition.row && current.col === goalPosition.col) {
      pathFound = true;
      finalPath = currentPath;
      break;
    }

    // Mark as visited
    visited.add(currentKey);

    // Create new state for this step - THEN mark as VISITED
    const visitedGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

    // Mark as visited (except start/goal)
    if (
      visitedGrid[current.row][current.col] !== "start" &&
      visitedGrid[current.row][current.col] !== "goal"
    ) {
      visitedGrid[current.row][current.col] = "visited";
      steps.push(visitedGrid);
    }

    // Get neighbors in a specific order
    const neighbors = getNeighborsInOrder(current, initialGrid, rows, cols);

    // Add neighbors to stack in reverse order
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const neighborKey = `${neighbor.row},${neighbor.col}`;

      if (!visited.has(neighborKey)) {
        stack.push([neighbor, [...currentPath, neighbor]]);
      }
    }
  }

  // If path was found, visualize it directly
  if (pathFound && finalPath.length > 0) {
    // Skip start and end positions
    for (let i = 1; i < finalPath.length - 1; i++) {
      const { row, col } = finalPath[i];

      // Create a new grid state for this step
      const pathGrid = JSON.parse(JSON.stringify(steps[steps.length - 1]));

      // Mark as path if not start or goal
      if (pathGrid[row][col] !== "start" && pathGrid[row][col] !== "goal") {
        pathGrid[row][col] = "path";
      }

      steps.push(pathGrid);
    }
  }

  return { steps, pathFound };
};

// Breadth-First Search (BFS) Visualization Logic
export const computeBFSSteps = (
  grid: CellType[][],
  startPosition: Position,
  goalPosition: Position,
  rows: number,
  cols: number
): { steps: CellType[][][]; pathFound: boolean } => {
  // Create a copy of the grid for our visualization
  const gridCopy: CellType[][] = grid.map((row) => [...row]);
  const steps: CellType[][][] = [JSON.parse(JSON.stringify(gridCopy))];

  // Queue for BFS, starting with the start position
  const queue: [Position, Position[]][] = [[startPosition, [startPosition]]];

  // Keep track of visited cells
  const visited: boolean[][] = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(false));
  visited[startPosition.row][startPosition.col] = true;

  // Directions to explore (up, right, down, left)
  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
  ];

  let pathFound = false;
  let finalPath: Position[] = [];

  while (queue.length > 0) {
    const [current, path] = queue.shift()!;

    // Mark current cell as being processed
    if (
      gridCopy[current.row][current.col] !== "start" &&
      gridCopy[current.row][current.col] !== "goal"
    ) {
      gridCopy[current.row][current.col] = "current";
      steps.push(JSON.parse(JSON.stringify(gridCopy)));
    }

    // Check if we've reached the goal
    if (current.row === goalPosition.row && current.col === goalPosition.col) {
      pathFound = true;
      finalPath = [...path];
      break;
    }

    // Mark as visited after processing
    if (
      gridCopy[current.row][current.col] !== "start" &&
      gridCopy[current.row][current.col] !== "goal"
    ) {
      gridCopy[current.row][current.col] = "visited";
      steps.push(JSON.parse(JSON.stringify(gridCopy)));
    }

    // Explore all four directions
    for (const dir of directions) {
      const nextRow = current.row + dir.row;
      const nextCol = current.col + dir.col;

      // Check if the new position is valid
      if (
        nextRow >= 0 &&
        nextRow < rows &&
        nextCol >= 0 &&
        nextCol < cols &&
        !visited[nextRow][nextCol] &&
        grid[nextRow][nextCol] !== "wall"
      ) {
        visited[nextRow][nextCol] = true;
        const nextPos = { row: nextRow, col: nextCol };
        queue.push([nextPos, [...path, nextPos]]);
      }
    }
  }

  // If a path was found, visualize it
  if (pathFound) {
    for (let i = 1; i < finalPath.length - 1; i++) {
      const { row, col } = finalPath[i];
      if (gridCopy[row][col] !== "start" && gridCopy[row][col] !== "goal") {
        gridCopy[row][col] = "path";
        steps.push(JSON.parse(JSON.stringify(gridCopy)));
      }
    }
  }

  return { steps, pathFound };
};

// Greedy Best-First Search Visualization Logic
export const computeGreedyBestFirstSteps = (
  grid: CellType[][],
  startPosition: Position,
  goalPosition: Position,
  rows: number,
  cols: number
): { steps: CellType[][][]; pathFound: boolean } => {
  // Create a copy of the grid for our visualization
  const gridCopy: CellType[][] = grid.map((row) => [...row]);
  const steps: CellType[][][] = [JSON.parse(JSON.stringify(gridCopy))];

  // Priority queue using array, sorted by heuristic (estimated distance to goal)
  const openSet: [Position, number, Position[]][] = [
    [startPosition, 0, [startPosition]],
  ];

  // Keep track of visited cells
  const visited: boolean[][] = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(false));

  // Directions to explore (up, right, down, left)
  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
  ];

  let pathFound = false;
  let finalPath: Position[] = [];

  // Heuristic function: Manhattan distance to goal
  const heuristic = (pos: Position): number => {
    return (
      Math.abs(pos.row - goalPosition.row) +
      Math.abs(pos.col - goalPosition.col)
    );
  };

  while (openSet.length > 0) {
    // Sort by heuristic value (ascending)
    openSet.sort((a, b) => a[1] - b[1]);

    const [current, _, path] = openSet.shift()!;

    // Skip if already visited
    if (visited[current.row][current.col]) continue;
    visited[current.row][current.col] = true;

    // Mark current cell as being processed
    if (
      gridCopy[current.row][current.col] !== "start" &&
      gridCopy[current.row][current.col] !== "goal"
    ) {
      gridCopy[current.row][current.col] = "current";
      steps.push(JSON.parse(JSON.stringify(gridCopy)));
    }

    // Check if we've reached the goal
    if (current.row === goalPosition.row && current.col === goalPosition.col) {
      pathFound = true;
      finalPath = [...path];
      break;
    }

    // Mark as visited after processing
    if (
      gridCopy[current.row][current.col] !== "start" &&
      gridCopy[current.row][current.col] !== "goal"
    ) {
      gridCopy[current.row][current.col] = "visited";
      steps.push(JSON.parse(JSON.stringify(gridCopy)));
    }

    // Explore all four directions
    for (const dir of directions) {
      const nextRow = current.row + dir.row;
      const nextCol = current.col + dir.col;

      // Check if the new position is valid
      if (
        nextRow >= 0 &&
        nextRow < rows &&
        nextCol >= 0 &&
        nextCol < cols &&
        !visited[nextRow][nextCol] &&
        grid[nextRow][nextCol] !== "wall"
      ) {
        const nextPos = { row: nextRow, col: nextCol };
        // For Greedy Best-First, we only consider the heuristic
        const h = heuristic(nextPos);
        openSet.push([nextPos, h, [...path, nextPos]]);
      }
    }
  }

  // If a path was found, visualize it
  if (pathFound) {
    for (let i = 1; i < finalPath.length - 1; i++) {
      const { row, col } = finalPath[i];
      if (gridCopy[row][col] !== "start" && gridCopy[row][col] !== "goal") {
        gridCopy[row][col] = "path";
        steps.push(JSON.parse(JSON.stringify(gridCopy)));
      }
    }
  }

  return { steps, pathFound };
};
