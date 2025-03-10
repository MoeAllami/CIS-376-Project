  import { useState, useEffect } from "react";

  // Define a functional component called "Sorting Visualizer"
  const SortingVisualizer = () => {
  
    const [array, setArray] = useState<number[]>([]);

    // Ensures an array is generated immediately when page loads
    useEffect(() => {
      generateArray();
    }, []);

    // Function to generate a random array
    const generateArray = () => {
      const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
      setArray(newArray);
  };

  // Defines an asynchronous function for using bubble sort
  const bubbleSort = async () => {
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) 
    {
      for (let j = 0; j < n - i - 1; j++) 
      {
        if (arr[j] > arr[j + 1]) 
        {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
          setArray([...arr]); // Used to update the UI with the new array state
          await new Promise((resolve) => setTimeout(resolve, 300)); // Delay for visualization
        }
      }
    }
  };

  const selectionSort = async () => {
    let arr = [...array];
    let n = arr.length;
    
    for (let i = 0; i < n - 1; i++){
      
      let min_idx = i; // Assume the current position holds the minimum element

      // Iterate through the unsorted portion to find the actual minimum
      for (let j = i + 1; j < n; j++)
      {
        if (arr[j] < arr[min_idx])
        {
          // Update min if a smaller element is found
          min_idx = j;
        }
      }

      [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]]; // Swap
      setArray([...arr]); // Used to update the UI with the new array state
      await new Promise((resolve) => setTimeout(resolve, 300)); // Delay for visualization
    }
  };

  // JSX rendering with tailwind css
  return (
  <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Sorting Visualizer</h2>
      <button onClick={generateArray} className="bg-blue-500 text-white p-2 m-2 rounded">
          Generate New Array
      </button>
      <button onClick={bubbleSort} className="bg-green-500 text-white p-2 rounded">
          Bubble Sort
      </button>
      <button onClick={selectionSort} className="bg-green-500 text-white p-2 rounded">
          Selection Sort
      </button>
      <div className="flex justify-center mt-4 space-x-2">
          {array.map((value, idx) => (
              <div key={idx} className="w-6 bg-green-500 text-white flex items-end justify-center" style={{ height: `${value}px` }}>
              {value}
          </div>
          ))}
      </div>
  </div>
  );
};

export default SortingVisualizer;
