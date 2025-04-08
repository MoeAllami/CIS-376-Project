export interface SortResult {
    steps: number[][];
    highlights: number[][];
  }
  
  // Bubble Sort
  export const computeBubbleSortSteps = (inputArray: number[]): SortResult => {
    const arr = [...inputArray];
    const steps: number[][] = [[...arr]];
    const highlights: number[][] = [[]];
  
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push([...arr]);
          highlights.push([j, j + 1]);
        }
      }
    }
  
    return { steps, highlights };
  };
  
  // Selection Sort
  export const computeSelectionSortSteps = (inputArray: number[]): SortResult => {
    const arr = [...inputArray];
    const steps: number[][] = [[...arr]];
    const highlights: number[][] = [[]];
  
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        steps.push([...arr]);
        highlights.push([i, minIndex]);
      }
    }
  
    return { steps, highlights };
  };
  
  // Insertion Sort
  export const computeInsertionSortSteps = (inputArray: number[]): SortResult => {
    const arr = [...inputArray];
    const steps: number[][] = [[...arr]];
    const highlights: number[][] = [[]];
  
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        steps.push([...arr]);
        highlights.push([j + 1, j + 2]);
      }
      arr[j + 1] = key;
      steps.push([...arr]);
      highlights.push([j + 1]);
    }
  
    return { steps, highlights };
  };
  
  // Quick Sort helpers
  const partition = (
    arr: number[],
    low: number,
    high: number,
    steps: number[][],
    highlights: number[][]
  ): number => {
    const pivot = arr[high];
    let i = low - 1;
  
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push([...arr]);
        highlights.push([i, j]);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push([...arr]);
    highlights.push([i + 1, high]);
    return i + 1;
  };
  
  const quickSortRecursive = (
    arr: number[],
    low: number,
    high: number,
    steps: number[][],
    highlights: number[][]
  ) => {
    if (low < high) {
      const pi = partition(arr, low, high, steps, highlights);
      quickSortRecursive(arr, low, pi - 1, steps, highlights);
      quickSortRecursive(arr, pi + 1, high, steps, highlights);
    }
  };
  
  export const computeQuickSortSteps = (inputArray: number[]): SortResult => {
    const arr = [...inputArray];
    const steps: number[][] = [[...arr]];
    const highlights: number[][] = [[]];
  
    quickSortRecursive(arr, 0, arr.length - 1, steps, highlights);
    return { steps, highlights };
  };
  