import { NextRequest, NextResponse } from 'next/server';
import {
  computeAStarSteps,
  computeDFSSteps,
  computeBFSSteps,
  computeGreedyBestFirstSteps,
} from '@/utils/PathingAlgorithms';

export async function POST(req: NextRequest) {
  // Parse the request body to extract required data
  const { grid, startPosition, goalPosition, algorithm, rows, cols } = await req.json();

  // Validate input: grid must be an array and all positions must be provided
  if (!Array.isArray(grid) || !startPosition || !goalPosition || !algorithm || !rows || !cols) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  let result;

  // Choose and execute the correct algorithm based on the request
  switch (algorithm) {
    case 'a-star':
      result = computeAStarSteps(grid, startPosition, goalPosition, rows, cols);
      break;
    case 'dfs':
      result = computeDFSSteps(grid, startPosition, goalPosition, rows, cols);
      break;
    case 'bfs':
      result = computeBFSSteps(grid, startPosition, goalPosition, rows, cols);
      break;
    case 'greedy':
      result = computeGreedyBestFirstSteps(grid, startPosition, goalPosition, rows, cols);
      break;
    default:
      return NextResponse.json({ error: 'Unknown algorithm' }, { status: 400 });
  }

  // Return the generated steps and pathFound status
  return NextResponse.json(result);
}
