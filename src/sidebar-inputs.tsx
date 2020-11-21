import React, { useState } from "react";
import { Square } from "./types/types";

type SidebarInputsProps = {
  squares: Square[];
  onSquaresChanged: (squares: Square[]) => void;
};

let lastT = 0;
let intervalId: NodeJS.Timeout | undefined = undefined

function SidebarInputs({ squares, onSquaresChanged }: SidebarInputsProps) {
  const [sideLength, setSideLength] = useState(40);
  const [squaresNumber, setSquaresNumber] = useState(100);
  const [spinningNumber, setSpinningNumber] = useState(0);
  const [fps, setFps] = useState(30);
  const [measuredFps, setMeasuredFps] = useState(0);
    
  function handleStartButtonClick() {
    readInputs();
    createSquares();
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (spinningNumber > 0) {
      intervalId = setInterval(() => {
        measureFps();
        spinSquares();
      }, 1000 / fps);
    }
  }

  function handleStopButtonClick() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function readInputs() {
    // Get sideLength
    const sideLengthInput = document.getElementById(
      "side-length"
    ) as HTMLInputElement;
    setSideLength(Number(sideLengthInput.value));
    // Get numberOfSquares
    const numberOfSquaresInput = document.getElementById(
      "num-squares"
    ) as HTMLInputElement;
    setSquaresNumber(Number(numberOfSquaresInput.value));
    // Get numberSpinning
    const numberSpinningInput = document.getElementById(
      "num-spinning"
    ) as HTMLInputElement;
    setSpinningNumber(Number(numberSpinningInput.value));
    // Get frames per sec
    const fpsInput = document.getElementById("req-fps") as HTMLInputElement;
    setFps(Number(fpsInput.value));
  }

  function distance(factor: number = 1.75) {
    return sideLength * factor;
  }

  function createSquares() {
    const squaresPerRow = Math.round(Math.sqrt(squaresNumber));
    squares = [];
    for (let n = 1; n <= squaresNumber; n++) {
      const row = Math.ceil(n / squaresPerRow);
      const colum = n - (row - 1) * squaresPerRow;
      const x = distance() * colum;
      const y = distance() * row;
      const square: Square = {
        x,
        y,
        sideLength: sideLength,
        rotation: 0,
        isHighligted: false,
        isSelected: false,
      };
      squares.push(square);
    }
    onSquaresChanged(squares);
  }

  function measureFps() {
    // Check whether this is the first run
    if (lastT === 0) {
      lastT = performance.now();
      return;
    }
    const t = performance.now();
    const diff = t - lastT;
    setMeasuredFps(Math.round(1000 / diff));
    lastT = t;
  }

  function spinSquares() {
    squares = squares.map((square, n) => {
      if (n < spinningNumber) {
        square = { ...square, rotation: square.rotation + 1 };
      }
      return square;
    });
    onSquaresChanged(squares);
    console.log(`Number of squares: ${squares.length}`);
  }

  return (
    <div id="input-parameters">
      <label htmlFor="side-length">Side length:</label>
      <input
        type="number"
        id="side-length"
        name="side-length"
        value={sideLength}
        onChange={(e) => setSideLength(Number(e.target.value))}
      />
      <label htmlFor="num-squares">Number of squares:</label>
      <input
        type="number"
        id="num-squares"
        name="num-squares"
        value={squaresNumber}
        onChange={(e) => setSquaresNumber(Number(e.target.value))}
      />
      <label htmlFor="num-spinning">Number spinning:</label>
      <input
        type="number"
        id="num-spinning"
        name="num-spinning"
        value={spinningNumber}
        onChange={(e) => setSpinningNumber(Number(e.target.value))}
      />
      <label htmlFor="req-fps">Frames per sec:</label>
      <input
        type="number"
        id="req-fps"
        name="req-fps"
        value={fps}
        onChange={(e) => setFps(Number(e.target.value))}
      />
      <div>
        <button onClick={handleStartButtonClick}>Start</button>
        <button onClick={handleStopButtonClick}>Stop</button>
      </div>
      <p>Measuring: {measuredFps} fps</p>
    </div>
  );
}

export default SidebarInputs;
