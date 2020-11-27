import React, { useState } from "react";
import { Square } from "./types/types";
import { ActionType, setSquares, rotateSquares } from "./squares-store";

type SidebarInputsProps = {
  dispatch: React.Dispatch<ActionType>;
};

let lastT = 0;
let intervalId: NodeJS.Timeout | undefined = undefined;
let fpsList: number[] = [];

function SidebarInputs({ dispatch }: SidebarInputsProps) {
  const [sideLength, setSideLength] = useState(40);
  const [squaresNumber, setSquaresNumber] = useState(100);
  const [spinningNumber, setSpinningNumber] = useState(0);
  const [requestedFps, setRequestedFps] = useState(30);
  const [lastFrameFps, setLastFrameFps] = useState(0);

  function handleStartButtonClick() {
    fpsList = [];
    createSquares();
    stopSpinning();

    if (spinningNumber > 0) {
      intervalId = setInterval(() => {
        measureFps();
        dispatch(rotateSquares(spinningNumber));
      }, 1000 / requestedFps);
    }
  }

  function stopSpinning() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function handleStopButtonClick() {
    stopSpinning();
  }

  const distance = 1.75 * sideLength;

  function createSquares() {
    const squaresPerRow = Math.round(Math.sqrt(squaresNumber));
    const nextSquares = [];
    for (let n = 1; n <= squaresNumber; n++) {
      const row = Math.ceil(n / squaresPerRow);
      const colum = n - (row - 1) * squaresPerRow;
      const x = distance * colum;
      const y = distance * row;
      const square: Square = {
        id: n.toString(),
        x,
        y,
        sideLength,
        rotation: 0,
        isHighligted: false,
        isSelected: false,
      };
      nextSquares.push(square);
    }
    dispatch(setSquares(nextSquares));
  }

  function measureFps() {
    // Check whether this is the first run
    if (lastT === 0) {
      lastT = performance.now();
      return;
    }
    const t = performance.now();
    const diff = t - lastT;
    const frameFps = Math.round(1000 / diff);
    setLastFrameFps(frameFps);
    fpsList.push(frameFps)
    // Save current time stamp for next run
    lastT = t;
  }

  function averageFps(subsetSize: number = 0) {
    
    if (fpsList.length === 0 || fpsList.length < subsetSize) {
      return 0;
    }

    const summer = (acc: number, current: number) => acc + current;
    if (subsetSize === 0) {
      const sum = fpsList.reduce(summer);
      return Math.round(sum / fpsList.length);
    } else {
      const lastItems = fpsList.slice(fpsList.length - subsetSize);
      const sum = lastItems.reduce(summer);
      return Math.round(sum / lastItems.length); 
    }
  }

  return (
    <div id="sidebar-inputs">
      <label htmlFor="side-length">Side length:</label>
      <input
        type="number"
        id="side-length"
        name="side-length"
        defaultValue={sideLength}
        onChange={(e) => setSideLength(Number(e.target.value))}
      />
      <label htmlFor="num-squares">Number of squares:</label>
      <input
        type="number"
        id="num-squares"
        name="num-squares"
        defaultValue={squaresNumber}
        onChange={(e) => setSquaresNumber(Number(e.target.value))}
      />
      <label htmlFor="num-spinning">Number spinning:</label>
      <input
        type="number"
        id="num-spinning"
        name="num-spinning"
        defaultValue={spinningNumber}
        onChange={(e) => setSpinningNumber(Number(e.target.value))}
      />
      <label htmlFor="req-fps">Frames per sec:</label>
      <input
        type="number"
        id="req-fps"
        name="req-fps"
        defaultValue={requestedFps}
        onChange={(e) => setRequestedFps(Number(e.target.value))}
      />
      <div>
        <button onClick={handleStartButtonClick}>Start</button>
        <button onClick={handleStopButtonClick}>Stop</button>
      </div>
      <p>Last frame: {lastFrameFps} fps</p>
      <p>Last 30 frames: {averageFps(30)} fps</p>
      <p>All frames: {averageFps()} fps</p>
    </div>
  );
}

export default SidebarInputs;
