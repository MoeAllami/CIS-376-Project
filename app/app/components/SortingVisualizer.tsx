import { useState, useEffect, useRef } from "react";

// Define a functional component called "Sorting Visualizer"
const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [speed, setSpeed] = useState(300); // Delay in milliseconds for visualization
  const [arraySize, setArraySize] = useState(10); // Number of elements in the array
  const [isSorting, setIsSorting] = useState(false); // Flag for start/stop control
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble"); // Default algorithm
  const stopRef = useRef(false); // Reference for pausing

  // Ensures an array is generated immediately and when size changes
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Function to generate a random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100 + 10)
    );
    setArray(newArray);
  };

  // Helper function to create delay
  const delay = (ms: number) =>
    new Promise<void>((res) => {
      const timer = setTimeout(() => {
        if (!stopRef.current) res();
        else clearTimeout(timer);
      }, ms);
    });

  // Defines an asynchronous function for using bubble sort
  const bubbleSort = async () => {
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1 && !stopRef.current; i++) {
      for (let j = 0; j < n - i - 1 && !stopRef.current; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
          setArray([...arr]); // Used to update the UI with the new array state
          await delay(speed); // Delay for visualization
        }
      }
    }
  };

  // Defines an asynchronous function for using selection sort
  const selectionSort = async () => {
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1 && !stopRef.current; i++) {
      let min_idx = i; // Assume the current position holds the minimum element

      // Iterate through the unsorted portion to find the actual minimum
      for (let j = i + 1; j < n && !stopRef.current; j++) {
        if (arr[j] < arr[min_idx]) {
          // Update min if a smaller element is found
          min_idx = j;
        }
      }

      [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]]; // Swap
      setArray([...arr]); // Used to update the UI with the new array state
      await delay(speed); // Delay for visualization
    }
  };

  // Defines an asynchronous function for using insertion sort
  const insertionSort = async () => {
    let arr = [...array];
    for (let i = 1; i < arr.length && !stopRef.current; i++) {
      let key = arr[i];
      let j = i - 1;
      // Move elements greater than key to one position ahead of current position
      while (j >= 0 && arr[j] > key && !stopRef.current) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
      setArray([...arr]); // Update UI with new array state
      await delay(speed); // Delay for visualization
    }
  };

  // Function to swap numbers in an array
  function swap(arr: number[], i: number, j: number) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  // Function used to partition the array during quick sort
  async function partition(arr: number[], low: number, high: number) {
    // Select pivot
    let pivot = arr[high];
    // The right position of the pivot so far
    let i = low - 1;

    // Move smaller elements to the left
    for (let j = low; j <= high - 1 && !stopRef.current; j++) {
      if (arr[j] < pivot) {
        i++;
        swap(arr, i, j);
        setArray([...arr]);
        await delay(speed); // Delay for visualization
      }
    }

    // Move pivot after smaller elements and return its position
    swap(arr, i + 1, high);
    setArray([...arr]);
    await delay(speed); // Delay for visualization
    return i + 1;
  }

  // QuickSort recursive function
  const quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high && !stopRef.current) {
      // set partition return index of pivot
      let pi = await partition(arr, low, high);

      // Recursion calls for smaller elements and >= elements
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  // Initiate sorting based on selected algorithm
  const startSort = async () => {
    stopRef.current = false;
    setIsSorting(true);
    let arr = [...array];
    switch (selectedAlgorithm) {
      case "bubble":
        await bubbleSort();
        break;
      case "selection":
        await selectionSort();
        break;
      case "insertion":
        await insertionSort();
        break;
      case "quick":
        await quickSort(arr, 0, arr.length - 1);
        break;
      default:
        break;
    }
    setIsSorting(false);
  };

  // Function to stop/pause sorting
  const stopSort = () => {
    stopRef.current = true;
    setIsSorting(false);
  };

  // JSX rendering with tailwind css
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
          max="50"
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

      <button
        onClick={generateArray}
        className="bg-blue-500 text-white p-2 m-2 rounded"
      >
        Generate New Array
      </button>

      <button
        onClick={startSort}
        disabled={isSorting}
        className="bg-green-600 text-white p-2 m-1 rounded"
      >
        Start
      </button>
      <button
        onClick={stopSort}
        disabled={!isSorting}
        className="bg-red-600 text-white p-2 m-1 rounded"
      >
        Stop
      </button>

      {/* Bar visual representation of the array */}
      <div className="flex justify-center items-end mt-4 space-x-1 h-60">
        {array.map((value, idx) => (
          <div
            key={idx}
            className="bg-green-500 text-black flex items-end justify-center"
            style={{ height: `${value * 2}px`, width: "20px" }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
