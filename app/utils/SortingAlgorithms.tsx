// SortingAlgorithms.tsx

export interface SortResult {
  steps: number[][];
  highlights: number[][];
  descriptions: string[];
  sortedIndices: number[][];
}

// Bubble Sort
export const computeBubbleSortSteps = (inputArray: number[]): SortResult => {
  const arr = [...inputArray];
  const steps: number[][] = [[...arr]];
  const highlights: number[][] = [[]];
  const descriptions: string[] = ["Initial array"];
  const sortedIndices: number[][] = [[]];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        descriptions.push(`Swapped elements at index ${j} and ${j + 1}`);
      } else {
        descriptions.push(`Compared ${arr[j]} and ${arr[j + 1]} — no swap`);
      }
      steps.push([...arr]);
      highlights.push([j, j + 1]);
      sortedIndices.push(
        Array.from({ length: i }, (_, k) => arr.length - k - 1)
      );
    }
  }

  steps.push([...arr]);
  highlights.push([]);
  descriptions.push("Array fully sorted");
  sortedIndices.push(arr.map((_, i) => i));

  return { steps, highlights, descriptions, sortedIndices };
};

// Selection Sort
export const computeSelectionSortSteps = (inputArray: number[]): SortResult => {
  const arr = [...inputArray];
  const steps: number[][] = [[...arr]];
  const highlights: number[][] = [[]];
  const descriptions: string[] = ["Initial array"];
  const sortedIndices: number[][] = [[]];

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      highlights.push([i, j]);
      steps.push([...arr]);
      descriptions.push(`Compared index ${i} and ${j}`);
      sortedIndices.push(Array.from({ length: i }, (_, k) => k));
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push([...arr]);
      highlights.push([i, minIndex]);
      descriptions.push(`Swapped index ${i} with min index ${minIndex}`);
      sortedIndices.push(Array.from({ length: i + 1 }, (_, k) => k));
    }
  }

  steps.push([...arr]);
  highlights.push([]);
  descriptions.push("Array fully sorted");
  sortedIndices.push(arr.map((_, i) => i));

  return { steps, highlights, descriptions, sortedIndices };
};

// Insertion Sort
export const computeInsertionSortSteps = (inputArray: number[]): SortResult => {
  const arr = [...inputArray];
  const steps: number[][] = [[...arr]];
  const highlights: number[][] = [[]];
  const descriptions: string[] = ["Initial array"];
  const sortedIndices: number[][] = [[]];

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    descriptions.push(`Picked element ${key} for insertion`);
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push([...arr]);
      highlights.push([j, j + 1]);
      descriptions.push(`Shifted ${arr[j]} right to index ${j + 1}`);
      sortedIndices.push(Array.from({ length: i }, (_, k) => k));
      j = j - 1;
    }
    arr[j + 1] = key;
    steps.push([...arr]);
    highlights.push([j + 1]);
    descriptions.push(`Inserted ${key} at index ${j + 1}`);
    sortedIndices.push(Array.from({ length: i + 1 }, (_, k) => k));
  }

  steps.push([...arr]);
  highlights.push([]);
  descriptions.push("Array fully sorted");
  sortedIndices.push(arr.map((_, i) => i));

  return { steps, highlights, descriptions, sortedIndices };
};

// Quick Sort
const partition = (
  arr: number[],
  low: number,
  high: number,
  steps: number[][],
  highlights: number[][],
  descriptions: string[],
  sortedIndices: number[][]
): number => {
  const pivot = arr[high];
  descriptions.push(`Pivot chosen: ${pivot} at index ${high}`);
  let i = low - 1;

  for (let j = low; j < high; j++) {
    highlights.push([j, high]);
    steps.push([...arr]);
    descriptions.push(`Comparing ${arr[j]} with pivot ${pivot}`);
    sortedIndices.push([]);
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push([...arr]);
      highlights.push([i, j]);
      descriptions.push(`Swapped ${arr[i]} and ${arr[j]}`);
      sortedIndices.push([]);
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  steps.push([...arr]);
  highlights.push([i + 1, high]);
  descriptions.push(`Moved pivot to index ${i + 1}`);
  sortedIndices.push([]);

  return i + 1;
};

const quickSortRecursive = (
  arr: number[],
  low: number,
  high: number,
  steps: number[][],
  highlights: number[][],
  descriptions: string[],
  sortedIndices: number[][]
) => {
  if (low < high) {
    const pi = partition(
      arr,
      low,
      high,
      steps,
      highlights,
      descriptions,
      sortedIndices
    );
    quickSortRecursive(
      arr,
      low,
      pi - 1,
      steps,
      highlights,
      descriptions,
      sortedIndices
    );
    quickSortRecursive(
      arr,
      pi + 1,
      high,
      steps,
      highlights,
      descriptions,
      sortedIndices
    );
  }
};

export const computeQuickSortSteps = (inputArray: number[]): SortResult => {
  const arr = [...inputArray];
  const steps: number[][] = [[...arr]];
  const highlights: number[][] = [[]];
  const descriptions: string[] = ["Initial array"];
  const sortedIndices: number[][] = [[]];

  quickSortRecursive(
    arr,
    0,
    arr.length - 1,
    steps,
    highlights,
    descriptions,
    sortedIndices
  );

  steps.push([...arr]);
  highlights.push([]);
  descriptions.push("Array fully sorted");
  sortedIndices.push(arr.map((_, i) => i));

  return { steps, highlights, descriptions, sortedIndices };
};
