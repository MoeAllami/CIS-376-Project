import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  computeBubbleSortSteps,
  computeSelectionSortSteps,
  computeInsertionSortSteps,
  computeQuickSortSteps,
  SortResult,
} from "../../utils/SortingAlgorithms";

const SortingVisualizer = () => {
  // SVG reference for D3 to operate on.
  const svgRef = useRef<SVGSVGElement>(null);

  // State variables
  const [array, setArray] = useState<number[]>([]); // Current array
  const [steps, setSteps] = useState<number[][]>([]); // List of all steps (snapshots)
  const [highlights, setHighlights] = useState<number[][]>([]); // Highlight info for each step
  const [descriptions, setDescriptions] = useState<string[]>([]); // Step by step descriptions
  const [sortedIndices, setSortedIndices] = useState<number[][]>([]); // Keeps state of currently sorted indices
  const [currentStep, setCurrentStep] = useState(0); // Current step index
  const [speed, setSpeed] = useState(300); // Playback speed (ms) used in transitions
  const [arraySize, setArraySize] = useState(10); // Number of elements in the array
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble"); // Chosen sorting algorithm
  const [isPlaying, setIsPlaying] = useState(false); // Is the animation playing?
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference for the playback interval

  // Generate a random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100 + 10)
    );
    setArray(newArray);

    // Decide which sort to run:
    let sortResult: SortResult;
    switch (selectedAlgorithm) {
      case "bubble":
        sortResult = computeBubbleSortSteps(newArray);
        break;
      case "selection":
        sortResult = computeSelectionSortSteps(newArray);
        break;
      case "insertion":
        sortResult = computeInsertionSortSteps(newArray);
        break;
      case "quick":
        sortResult = computeQuickSortSteps(newArray);
        break;
      default:
        // Fallback: no highlights, just single-step array
        sortResult = {
          steps: [[...newArray]],
          highlights: [[]],
          descriptions: ["Initial array"],
          sortedIndices: [[]],
        };
        break;
    }

    // Store in state
    setSteps(sortResult.steps);
    setHighlights(sortResult.highlights);
    setDescriptions(sortResult.descriptions);
    setSortedIndices(sortResult.sortedIndices);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (currentStep === steps.length - 1 || steps.length === 0) {
      generateArray();
    }
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [selectedAlgorithm]);

  //  Renders the current step in steps[currentStep] whenever it changes.
  //  We also read "highlights" for that step to color them differently.
  useEffect(() => {
    if (!svgRef.current || steps.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const data = steps[currentStep];
    const highlightIndices = highlights[currentStep] || [];
    const sorted = sortedIndices[currentStep] || [];

    // Controls spacing between bars
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
      // Use orange if highlighted, green if sorted, else steelblue
      .attr("fill", (_, i) => {
        if (highlightIndices.includes(i)) return "orange";
        if (sorted.includes(i)) return "green";
        return "steelblue";
      });

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
  }, [steps, highlights, sortedIndices, currentStep, speed]);

  // Play function
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

  //  Pause or Stop
  const pause = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  //  Step Forward / Step Back
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  //  JSX Layout
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
      {/* Step Description */}
      <div className="mt-4">
        <p className="text-lg font-medium">
          Step {currentStep + 1}: {descriptions[currentStep] || "Processing..."}
        </p>
        {selectedAlgorithm === "quick" && (
          <p className="text-sm text-gray-400 italic">
            (Note: Quick Sort uses divide and conquer — highlighted subarray is
            the current recursive partition.)
          </p>
        )}
      </div>
    </div>
  );
};

export default SortingVisualizer;
