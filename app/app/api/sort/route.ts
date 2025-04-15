import { NextRequest, NextResponse } from 'next/server';
import {
  computeBubbleSortSteps,
  computeSelectionSortSteps,
  computeInsertionSortSteps,
  computeQuickSortSteps
} from '@/utils/SortingAlgorithms';

export async function POST(req: NextRequest) {
  const { array, algorithm } = await req.json();

  if (!Array.isArray(array) || !algorithm) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  let result;

  switch (algorithm) {
    case 'bubble':
      result = computeBubbleSortSteps(array);
      break;
    case 'selection':
      result = computeSelectionSortSteps(array);
      break;
    case 'insertion':
      result = computeInsertionSortSteps(array);
      break;
    case 'quick':
      result = computeQuickSortSteps(array);
      break;
    default:
      return NextResponse.json({ error: 'Unknown algorithm' }, { status: 400 });
  }

  return NextResponse.json(result);
}
