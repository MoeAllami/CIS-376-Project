import {
  computeBubbleSortSteps,
  computeSelectionSortSteps,
  computeInsertionSortSteps,
  computeQuickSortSteps,
  SortResult,
} from "../utils/SortingAlgorithms";

// --- Helper Functions ---

/**
 * Generates an array of random integers.
 * @param length The desired length of the array.
 * @param maxVal The maximum value for random numbers (exclusive).
 * @returns An array of random numbers.
 */
function generateRandomArray(length: number, maxVal: number = 100): number[] {
  if (length <= 0) {
    return [];
  }
  return Array.from({ length }, () => Math.floor(Math.random() * maxVal));
}

/**
 * Compares two arrays for equality.
 * @param arr1 The first array.
 * @param arr2 The second array.
 * @returns True if the arrays are identical, false otherwise.
 */
function arraysAreEqual(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  // Using JSON.stringify for simple comparison as in the example
  // For complex objects or potential NaN/Infinity, a loop might be better.
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

/**
 * Runs a standard set of tests for a given sorting function.
 * @param sortFunctionName The name of the sorting algorithm (for logging).
 * @param computeStepsFn The visualization function to test.
 */
function runSortTests(
  sortFunctionName: string,
  computeStepsFn: (inputArray: number[]) => SortResult
) {
  console.log(`--- Testing ${sortFunctionName} ---`);

  // Test with random arrays
  for (let i = 1; i <= 3; i++) {
    const arr = generateRandomArray(10); // Test with arrays of size 10
    const result: SortResult = computeStepsFn([...arr]); // Pass a copy
    const customSorted = result.steps[result.steps.length - 1]; // Get the final state
    const expected = [...arr].sort((a, b) => a - b);
    const passed = arraysAreEqual(customSorted, expected);

    console.log(`Random Test ${i}: ${passed ? "Passed" : "Failed"}`);
    if (!passed) {
      console.log(`  Original:  [${arr.join(", ")}]`);
      console.log(`  ${sortFunctionName}: [${customSorted.join(", ")}]`);
      console.log(`  Expected:  [${expected.join(", ")}]`);
    }
  }

  // Test with a fixed array
  const fixed = [42, 5, 17, 88, 3, 25, 99, 1, 66, 10];
  let resultFixed = computeStepsFn([...fixed]);
  let customFixed = resultFixed.steps[resultFixed.steps.length - 1];
  let expectedFixed = [...fixed].sort((a, b) => a - b);
  let passedFixed = arraysAreEqual(customFixed, expectedFixed);

  console.log(`Fixed Test:    ${passedFixed ? "Passed" : "Failed"}`);
  if (!passedFixed) {
    console.log(`  Original:  [${fixed.join(", ")}]`);
    console.log(`  ${sortFunctionName}: [${customFixed.join(", ")}]`);
    console.log(`  Expected:  [${expectedFixed.join(", ")}]`);
  }

  // Test with an empty array
  const empty: number[] = [];
  let resultEmpty = computeStepsFn([...empty]);
  let customEmpty = resultEmpty.steps[resultEmpty.steps.length - 1];
  let expectedEmpty = [...empty].sort((a, b) => a - b);
  let passedEmpty = arraysAreEqual(customEmpty, expectedEmpty);

  console.log(`Empty Test:    ${passedEmpty ? "Passed" : "Failed"}`);
  if (!passedEmpty) {
    console.log(`  Original:  [${empty.join(", ")}]`);
    console.log(`  ${sortFunctionName}: [${customEmpty.join(", ")}]`);
    console.log(`  Expected:  [${expectedEmpty.join(", ")}]`);
  }

  // Test with a single-element array
  const single = [42];
  let resultSingle = computeStepsFn([...single]);
  let customSingle = resultSingle.steps[resultSingle.steps.length - 1];
  let expectedSingle = [...single].sort((a, b) => a - b);
  let passedSingle = arraysAreEqual(customSingle, expectedSingle);

  console.log(`Single Test:   ${passedSingle ? "Passed" : "Failed"}`);
  if (!passedSingle) {
    console.log(`  Original:  [${single.join(", ")}]`);
    console.log(`  ${sortFunctionName}: [${customSingle.join(", ")}]`);
    console.log(`  Expected:  [${expectedSingle.join(", ")}]`);
  }

  // Test with an already sorted array
  const sortedArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let resultSorted = computeStepsFn([...sortedArr]);
  let customSortedArr = resultSorted.steps[resultSorted.steps.length - 1];
  let expectedSortedArr = [...sortedArr].sort((a, b) => a - b);
  let passedSorted = arraysAreEqual(customSortedArr, expectedSortedArr);

  console.log(`Sorted Test:   ${passedSorted ? "Passed" : "Failed"}`);
  if (!passedSorted) {
    console.log(`  Original:  [${sortedArr.join(", ")}]`);
    console.log(`  ${sortFunctionName}: [${customSortedArr.join(", ")}]`);
    console.log(`  Expected:  [${expectedSortedArr.join(", ")}]`);
  }

  // Test with a reverse sorted array
  const reverseSortedArr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  let resultReverse = computeStepsFn([...reverseSortedArr]);
  let customReverse = resultReverse.steps[resultReverse.steps.length - 1];
  let expectedReverse = [...reverseSortedArr].sort((a, b) => a - b);
  let passedReverse = arraysAreEqual(customReverse, expectedReverse);

  console.log(`Reverse Test:  ${passedReverse ? "Passed" : "Failed"}`);
  if (!passedReverse) {
    console.log(`  Original:  [${reverseSortedArr.join(", ")}]`);
    console.log(`  ${sortFunctionName}: [${customReverse.join(", ")}]`);
    console.log(`  Expected:  [${expectedReverse.join(", ")}]`);
  }

  console.log(`--- Finished Testing ${sortFunctionName} ---\n`);
}

// --- Main Execution ---

console.log("====== Starting Sorting Algorithm Tests ======\n");

runSortTests("Bubble Sort", computeBubbleSortSteps);
runSortTests("Selection Sort", computeSelectionSortSteps);
runSortTests("Insertion Sort", computeInsertionSortSteps);
runSortTests("Quick Sort", computeQuickSortSteps);

console.log("====== Sorting Algorithm Tests Complete ======");
