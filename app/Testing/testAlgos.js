"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var SortingAlgorithms_1 = require("../utils/SortingAlgorithms");
// --- Helper Functions ---
/**
 * Generates an array of random integers.
 * @param length The desired length of the array.
 * @param maxVal The maximum value for random numbers (exclusive).
 * @returns An array of random numbers.
 */
function generateRandomArray(length, maxVal) {
    if (maxVal === void 0) { maxVal = 100; }
    if (length <= 0) {
        return [];
    }
    return Array.from({ length: length }, function () { return Math.floor(Math.random() * maxVal); });
}
/**
 * Compares two arrays for equality.
 * @param arr1 The first array.
 * @param arr2 The second array.
 * @returns True if the arrays are identical, false otherwise.
 */
function arraysAreEqual(arr1, arr2) {
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
function runSortTests(sortFunctionName, computeStepsFn) {
    console.log("--- Testing ".concat(sortFunctionName, " ---"));
    // Test with random arrays
    for (var i = 1; i <= 3; i++) {
        var arr = generateRandomArray(10); // Test with arrays of size 10
        var result = computeStepsFn(__spreadArray([], arr, true)); // Pass a copy
        var customSorted = result.steps[result.steps.length - 1]; // Get the final state
        var expected = __spreadArray([], arr, true).sort(function (a, b) { return a - b; });
        var passed = arraysAreEqual(customSorted, expected);
        console.log("Random Test ".concat(i, ": ").concat(passed ? "Passed" : "Failed"));
        if (!passed) {
            console.log("  Original:  [".concat(arr.join(", "), "]"));
            console.log("  ".concat(sortFunctionName, ": [").concat(customSorted.join(", "), "]"));
            console.log("  Expected:  [".concat(expected.join(", "), "]"));
        }
    }
    // Test with a fixed array
    var fixed = [42, 5, 17, 88, 3, 25, 99, 1, 66, 10];
    var resultFixed = computeStepsFn(__spreadArray([], fixed, true));
    var customFixed = resultFixed.steps[resultFixed.steps.length - 1];
    var expectedFixed = __spreadArray([], fixed, true).sort(function (a, b) { return a - b; });
    var passedFixed = arraysAreEqual(customFixed, expectedFixed);
    console.log("Fixed Test:    ".concat(passedFixed ? "Passed" : "Failed"));
    if (!passedFixed) {
        console.log("  Original:  [".concat(fixed.join(", "), "]"));
        console.log("  ".concat(sortFunctionName, ": [").concat(customFixed.join(", "), "]"));
        console.log("  Expected:  [".concat(expectedFixed.join(", "), "]"));
    }
    // Test with an empty array
    var empty = [];
    var resultEmpty = computeStepsFn(__spreadArray([], empty, true));
    var customEmpty = resultEmpty.steps[resultEmpty.steps.length - 1];
    var expectedEmpty = __spreadArray([], empty, true).sort(function (a, b) { return a - b; });
    var passedEmpty = arraysAreEqual(customEmpty, expectedEmpty);
    console.log("Empty Test:    ".concat(passedEmpty ? "Passed" : "Failed"));
    if (!passedEmpty) {
        console.log("  Original:  [".concat(empty.join(", "), "]"));
        console.log("  ".concat(sortFunctionName, ": [").concat(customEmpty.join(", "), "]"));
        console.log("  Expected:  [".concat(expectedEmpty.join(", "), "]"));
    }
    // Test with a single-element array
    var single = [42];
    var resultSingle = computeStepsFn(__spreadArray([], single, true));
    var customSingle = resultSingle.steps[resultSingle.steps.length - 1];
    var expectedSingle = __spreadArray([], single, true).sort(function (a, b) { return a - b; });
    var passedSingle = arraysAreEqual(customSingle, expectedSingle);
    console.log("Single Test:   ".concat(passedSingle ? "Passed" : "Failed"));
    if (!passedSingle) {
        console.log("  Original:  [".concat(single.join(", "), "]"));
        console.log("  ".concat(sortFunctionName, ": [").concat(customSingle.join(", "), "]"));
        console.log("  Expected:  [".concat(expectedSingle.join(", "), "]"));
    }
    // Test with an already sorted array
    var sortedArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var resultSorted = computeStepsFn(__spreadArray([], sortedArr, true));
    var customSortedArr = resultSorted.steps[resultSorted.steps.length - 1];
    var expectedSortedArr = __spreadArray([], sortedArr, true).sort(function (a, b) { return a - b; });
    var passedSorted = arraysAreEqual(customSortedArr, expectedSortedArr);
    console.log("Sorted Test:   ".concat(passedSorted ? "Passed" : "Failed"));
    if (!passedSorted) {
        console.log("  Original:  [".concat(sortedArr.join(", "), "]"));
        console.log("  ".concat(sortFunctionName, ": [").concat(customSortedArr.join(", "), "]"));
        console.log("  Expected:  [".concat(expectedSortedArr.join(", "), "]"));
    }
    // Test with a reverse sorted array
    var reverseSortedArr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    var resultReverse = computeStepsFn(__spreadArray([], reverseSortedArr, true));
    var customReverse = resultReverse.steps[resultReverse.steps.length - 1];
    var expectedReverse = __spreadArray([], reverseSortedArr, true).sort(function (a, b) { return a - b; });
    var passedReverse = arraysAreEqual(customReverse, expectedReverse);
    console.log("Reverse Test:  ".concat(passedReverse ? "Passed" : "Failed"));
    if (!passedReverse) {
        console.log("  Original:  [".concat(reverseSortedArr.join(", "), "]"));
        console.log("  ".concat(sortFunctionName, ": [").concat(customReverse.join(", "), "]"));
        console.log("  Expected:  [".concat(expectedReverse.join(", "), "]"));
    }
    console.log("--- Finished Testing ".concat(sortFunctionName, " ---\n"));
}
// --- Main Execution ---
console.log("====== Starting Sorting Algorithm Tests ======\n");
runSortTests("Bubble Sort", SortingAlgorithms_1.computeBubbleSortSteps);
runSortTests("Selection Sort", SortingAlgorithms_1.computeSelectionSortSteps);
runSortTests("Insertion Sort", SortingAlgorithms_1.computeInsertionSortSteps);
runSortTests("Quick Sort", SortingAlgorithms_1.computeQuickSortSteps);
console.log("====== Sorting Algorithm Tests Complete ======");
