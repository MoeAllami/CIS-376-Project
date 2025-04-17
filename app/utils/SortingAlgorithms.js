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
exports.computeQuickSortSteps = exports.computeInsertionSortSteps = exports.computeSelectionSortSteps = exports.computeBubbleSortSteps = void 0;
// Bubble Sort Visualization Logic
var computeBubbleSortSteps = function (inputArray) {
    var _a;
    var arr = __spreadArray([], inputArray, true); // Make a copy of the input
    var steps = [__spreadArray([], arr, true)];
    var highlights = [[]];
    var descriptions = ["Initial array"];
    var sortedIndices = [[]];
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                _a = [arr[j + 1], arr[j]], arr[j] = _a[0], arr[j + 1] = _a[1];
                descriptions.push("Swapped elements at index ".concat(j, " and ").concat(j + 1));
            }
            else {
                descriptions.push("Compared ".concat(arr[j], " and ").concat(arr[j + 1], " \u2014 no swap"));
            }
            steps.push(__spreadArray([], arr, true));
            highlights.push([j, j + 1]);
            sortedIndices.push(Array.from({ length: i }, function (_, k) { return arr.length - k - 1; }) // Elements at the end are already sorted
            );
        }
    }
    // Final state
    steps.push(__spreadArray([], arr, true));
    highlights.push([]);
    descriptions.push("Array fully sorted");
    sortedIndices.push(arr.map(function (_, i) { return i; }));
    return { steps: steps, highlights: highlights, descriptions: descriptions, sortedIndices: sortedIndices };
};
exports.computeBubbleSortSteps = computeBubbleSortSteps;
// Selection Sort Visualization Logic
var computeSelectionSortSteps = function (inputArray) {
    var _a;
    var arr = __spreadArray([], inputArray, true);
    var steps = [__spreadArray([], arr, true)];
    var highlights = [[]];
    var descriptions = ["Initial array"];
    var sortedIndices = [[]];
    for (var i = 0; i < arr.length - 1; i++) {
        var minIndex = i;
        for (var j = i + 1; j < arr.length; j++) {
            highlights.push([i, j]);
            steps.push(__spreadArray([], arr, true));
            descriptions.push("Compared index ".concat(i, " and ").concat(j));
            sortedIndices.push(Array.from({ length: i }, function (_, k) { return k; })); // Everything before i is sorted
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            _a = [arr[minIndex], arr[i]], arr[i] = _a[0], arr[minIndex] = _a[1];
            steps.push(__spreadArray([], arr, true));
            highlights.push([i, minIndex]);
            descriptions.push("Swapped index ".concat(i, " with min index ").concat(minIndex));
            sortedIndices.push(Array.from({ length: i + 1 }, function (_, k) { return k; }));
        }
    }
    steps.push(__spreadArray([], arr, true));
    highlights.push([]);
    descriptions.push("Array fully sorted");
    sortedIndices.push(arr.map(function (_, i) { return i; }));
    return { steps: steps, highlights: highlights, descriptions: descriptions, sortedIndices: sortedIndices };
};
exports.computeSelectionSortSteps = computeSelectionSortSteps;
// Insertion Sort Visualization Logic
var computeInsertionSortSteps = function (inputArray) {
    var arr = __spreadArray([], inputArray, true);
    var steps = [__spreadArray([], arr, true)];
    var highlights = [[]];
    var descriptions = ["Initial array"];
    var sortedIndices = [[]];
    for (var i = 1; i < arr.length; i++) {
        var key = arr[i];
        var j = i - 1;
        descriptions.push("Picked element ".concat(key, " for insertion"));
        // Shift elements to the right until correct position is found
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            steps.push(__spreadArray([], arr, true));
            highlights.push([j, j + 1]);
            descriptions.push("Shifted ".concat(arr[j], " right to index ").concat(j + 1));
            sortedIndices.push(Array.from({ length: i }, function (_, k) { return k; }));
            j--;
        }
        // Insert the key
        arr[j + 1] = key;
        steps.push(__spreadArray([], arr, true));
        highlights.push([j + 1]);
        descriptions.push("Inserted ".concat(key, " at index ").concat(j + 1));
        sortedIndices.push(Array.from({ length: i + 1 }, function (_, k) { return k; }));
    }
    steps.push(__spreadArray([], arr, true));
    highlights.push([]);
    descriptions.push("Array fully sorted");
    sortedIndices.push(arr.map(function (_, i) { return i; }));
    return { steps: steps, highlights: highlights, descriptions: descriptions, sortedIndices: sortedIndices };
};
exports.computeInsertionSortSteps = computeInsertionSortSteps;
// Quick Sort Visualization Logic
// Partition helper: moves pivot to correct location and partitions the array
var partition = function (arr, low, high, steps, highlights, descriptions, sortedIndices) {
    var _a, _b;
    var pivot = arr[high];
    descriptions.push("Pivot chosen: ".concat(pivot, " at index ").concat(high));
    var i = low - 1;
    for (var j = low; j < high; j++) {
        highlights.push([j, high]);
        steps.push(__spreadArray([], arr, true));
        descriptions.push("Comparing ".concat(arr[j], " with pivot ").concat(pivot));
        sortedIndices.push([]);
        if (arr[j] < pivot) {
            i++;
            _a = [arr[j], arr[i]], arr[i] = _a[0], arr[j] = _a[1];
            steps.push(__spreadArray([], arr, true));
            highlights.push([i, j]);
            descriptions.push("Swapped ".concat(arr[i], " and ").concat(arr[j]));
            sortedIndices.push([]);
        }
    }
    _b = [arr[high], arr[i + 1]], arr[i + 1] = _b[0], arr[high] = _b[1];
    steps.push(__spreadArray([], arr, true));
    highlights.push([i + 1, high]);
    descriptions.push("Moved pivot to index ".concat(i + 1));
    sortedIndices.push([]);
    return i + 1;
};
// Recursive quick sort helper
var quickSortRecursive = function (arr, low, high, steps, highlights, descriptions, sortedIndices) {
    if (low < high) {
        var pi = partition(arr, low, high, steps, highlights, descriptions, sortedIndices);
        quickSortRecursive(arr, low, pi - 1, steps, highlights, descriptions, sortedIndices);
        quickSortRecursive(arr, pi + 1, high, steps, highlights, descriptions, sortedIndices);
    }
};
// Public quick sort function
var computeQuickSortSteps = function (inputArray) {
    var arr = __spreadArray([], inputArray, true);
    var steps = [__spreadArray([], arr, true)];
    var highlights = [[]];
    var descriptions = ["Initial array"];
    var sortedIndices = [[]];
    quickSortRecursive(arr, 0, arr.length - 1, steps, highlights, descriptions, sortedIndices);
    steps.push(__spreadArray([], arr, true));
    highlights.push([]);
    descriptions.push("Array fully sorted");
    sortedIndices.push(arr.map(function (_, i) { return i; }));
    return { steps: steps, highlights: highlights, descriptions: descriptions, sortedIndices: sortedIndices };
};
exports.computeQuickSortSteps = computeQuickSortSteps;
