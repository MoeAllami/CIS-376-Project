'use client';
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

      .attr("fill", (_, i) => {
        if (sorted.includes(i)) return "green";

        // Only use red for pivot if quick sort is selected
        if (
          selectedAlgorithm === "quick" &&
          highlightIndices.length === 2 &&
          i === highlightIndices[1]
        ) {
          return "red"; // Pivot
        }

        if (highlightIndices.includes(i)) return "orange"; // Comparing
        return "steelblue"; // Default
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
    <div className="w-screen h-screen overflow-hidden flex flex-col items-center bg-gray-900">
      <h2 className="text-2xl font-bold text-white mt-4 mb-2">
        Sorting Visualizer
      </h2>

      {/* Panel Container */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 w-11/12 max-w-4xl text-white space-y-4">
        {/* Step Description */}
        <div className="text-center">
          <p className="text-lg font-medium">
            Step {currentStep + 1}:{" "}
            {descriptions[currentStep] || "Processing..."}
          </p>
          {selectedAlgorithm === "quick" && (
            <p className="text-sm text-gray-400 italic">
              (Quick Sort uses divide and conquer — highlighted subarray is the
              current recursive partition.)
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <div>
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
          <div>
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
          <div>
            <label className="mr-2 font-semibold">Algorithm:</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="p-1 rounded text-black"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="quick">Quick Sort</option>
            </select>
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={generateArray}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Generate New Array
          </button>
          <button
            onClick={stepBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            ◀ Step Back
          </button>
          <button
            onClick={isPlaying ? pause : play}
            className={`${
              isPlaying ? "bg-red-600" : "bg-green-600"
            } hover:brightness-110 text-white px-4 py-2 rounded`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={stepForward}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Step Forward ▶
          </button>
        </div>

        {/* Color Key */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[steelblue] mr-2 rounded"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 mr-2 rounded"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
            <span>Pivot (Quick Sort)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
            <span>Sorted</span>
          </div>
        </div>
      </div>

      {/*SVG Visualizer*/}
      <svg
        ref={svgRef}
        className="w-full h-[40vh] mt-auto"
        preserveAspectRatio="none"
      />
    </div>
  );
};

export default SortingVisualizer;
