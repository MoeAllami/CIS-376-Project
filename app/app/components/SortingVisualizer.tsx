import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const SortingVisualizer = () => {
  // SVG reference for D3 to operate on.
  const svgRef = useRef<SVGSVGElement>(null);

  // State variables
  const [array, setArray] = useState<number[]>([]); // Current array
  const [steps, setSteps] = useState<number[][]>([]); // List of all steps (snapshots) for the chosen algorithm
  const [currentStep, setCurrentStep] = useState(0); // Current step index
  const [speed, setSpeed] = useState(300); // Playback speed (ms) used in transitions
  const [arraySize, setArraySize] = useState(10); // Number of elements in the array
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble"); // Chosen sorting algorithm
  const [isPlaying, setIsPlaying] = useState(false); // Is the animation playing?
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference for the playback interval

  // Function to generate a random array based on the current arraySize
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100 + 10)
    );
    setArray(newArray);

    // Reset any existing steps and step index whenever a new array is generated
    // but also immediately compute steps for the selected algorithm.
    let recordedSteps: number[][] = [];

    switch (selectedAlgorithm) {
      case "bubble":
        recordedSteps = computeBubbleSortSteps(newArray);
        break;
      case "selection":
        recordedSteps = computeSelectionSortSteps(newArray);
        break;
      case "insertion":
        recordedSteps = computeInsertionSortSteps(newArray);
        break;
      case "quick":
        recordedSteps = computeQuickSortSteps(newArray);
        break;
      default:
        recordedSteps = [[...newArray]]; // fallback
        break;
    }

    setSteps(recordedSteps);
    setCurrentStep(0);
  };

  // Re-generate the array when arraySize changes
  useEffect(() => {
    if (currentStep === steps.length - 1 || steps.length === 0) {
      generateArray();
    }
  }, [arraySize]);

  // Bubble Sort Steps
  // Captures array state after each swap.
  const computeBubbleSortSteps = (inputArray: number[]) => {
    const arr = [...inputArray];
    const result: number[][] = [[...arr]]; // initial snapshot

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          result.push([...arr]); // push snapshot each time we swap
        }
      }
    }
    return result;
  };

  // Selection Sort Steps
  // Find the minimum in the unsorted region and swap.
  const computeSelectionSortSteps = (inputArray: number[]) => {
    const arr = [...inputArray];
    const result: number[][] = [[...arr]]; // initial snapshot

    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      // Only swap if different
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        result.push([...arr]); // push snapshot after swapping
      }
    }
    return result;
  };

  // Insertion Sort Steps
  // Insert each element into its correct position in the sorted portion.
  const computeInsertionSortSteps = (inputArray: number[]) => {
    const arr = [...inputArray];
    const result: number[][] = [[...arr]]; // initial snapshot

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        result.push([...arr]); // push snapshot after each shift
      }
      arr[j + 1] = key;
      result.push([...arr]); // snapshot after placing the key
    }

    return result;
  };

  // Quick Sort Steps
  // Partition function that returns the pivot index, pushing states to result.
  const partition = (
    arr: number[],
    low: number,
    high: number,
    result: number[][]
  ) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        result.push([...arr]); // snapshot after each swap
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    result.push([...arr]); // pivot placed
    return i + 1;
  };

  // Recursive quick sort that accumulates states in "result".
  const quickSortRecursive = (
    arr: number[],
    low: number,
    high: number,
    result: number[][]
  ) => {
    if (low < high) {
      const pi = partition(arr, low, high, result);
      quickSortRecursive(arr, low, pi - 1, result);
      quickSortRecursive(arr, pi + 1, high, result);
    }
  };

  const computeQuickSortSteps = (inputArray: number[]) => {
    const arr = [...inputArray];
    const result: number[][] = [[...arr]]; // initial snapshot
    quickSortRecursive(arr, 0, arr.length - 1, result);
    return result;
  };

  // Renders the current step in steps[currentStep] whenever it changes.
  useEffect(() => {
    if (!svgRef.current || steps.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const data = steps[currentStep];

    const gap = 10;
    const barWidth = width / data.length;
    const actualBarWidth = barWidth - gap;

    // Transition for rectangles
    svg
      .selectAll("rect")
      .data(data, (d, i) => i)
      .join("rect")
      .transition()
      .duration(speed / 1.2)
      .attr("x", (_, i) => i * barWidth)
      .attr("y", (d) => height - d * 2)
      .attr("width", actualBarWidth)
      .attr("height", (d) => d * 2)
      .attr("fill", "steelblue");

    // Transition for text labels
    svg
      .selectAll("text")
      .data(data)
      .join("text")
      .transition()
      .duration(speed / 1.2)
      .text((d) => d)
      .attr("x", (_, i) => i * barWidth + actualBarWidth / 2)
      .attr("y", (d) => height - d * 2 - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", 12);
  }, [steps, currentStep, speed]);

  // Play continuous steps.
  const play = () => {
    if (currentStep >= steps.length - 1) return; // Nothing to play if at last step

    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          // If we've reached the last step, stop.
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  // Pause/Stop the animation.
  const pause = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Move one step forward
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move one step backward
  const stepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Sorting Visualizer</h2>

      {/* Slider for adjusting speed */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Speed:</label>
        <input
          type="range"
          min="50"
          max="1000"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span className="ml-2">{speed} ms</span>
      </div>

      {/* Slider for adjusting array size */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Array Size:</label>
        <input
          type="range"
          min="5"
          max="25"
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
        />
        <span className="ml-2">{arraySize}</span>
      </div>

      {/* Dropdown to select sorting algorithm */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Algorithm:</label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          className="p-2 border rounded text-black"
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
        </select>
      </div>

      {/* Control buttons */}
      <div className="space-x-2 mb-4">
        <button
          onClick={generateArray}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Generate New Array
        </button>
        {/* Step Back button */}
        <button
          onClick={stepBack}
          className="bg-gray-600 text-white p-2 rounded"
        >
          ◀ Step Back
        </button>
        {/* Play/Pause toggle button */}
        <button
          onClick={isPlaying ? pause : play}
          className="bg-green-600 text-white p-2 rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        {/* Step Forward button */}
        <button
          onClick={stepForward}
          className="bg-gray-600 text-white p-2 rounded"
        >
          Step Forward ▶
        </button>
      </div>

      {/* SVG container for bars */}
      <svg
        ref={svgRef}
        className="w-full h-96 mx-auto"
        preserveAspectRatio="none"
      />
    </div>
  );
};

export default SortingVisualizer;
