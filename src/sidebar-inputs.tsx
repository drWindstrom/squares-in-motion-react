import React, {useState} from "react";
import {Square} from "./types/types";

type SidebarInputsProps = { 
  squares: Square[];

};

function SidebarInputs({}: SidebarInputsProps) {
  
  const [sideLength, setSideLength] = useState(40);
  const [squaresNumber, setSquaresNumber] = useState(100);
  const [spinningNumber, setSpinningNumber] = useState(0);
  const [fps, setFps] = useState(30);
  const [measuredFps, setMeasuredFps] = useState(0);  
  
  let intervalId: NodeJS.Timeout | undefined = undefined;

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
  if(intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
}

function readInputs() {
  // Get sideLength
  const sideLengthInput = document.getElementById(
    'side-length'
  ) as HTMLInputElement;
  setSideLength(Number(sideLengthInput.value));
  // Get numberOfSquares
  const numberOfSquaresInput = document.getElementById(
    'num-squares'
  ) as HTMLInputElement;
  setSquaresNumber(Number(numberOfSquaresInput.value));
  // Get numberSpinning
  const numberSpinningInput = document.getElementById(
    'num-spinning'
  ) as HTMLInputElement;
  setSpinningNumber(Number(numberSpinningInput.value));
  // Get frames per sec
  const fpsInput = document.getElementById(
    'req-fps'
  ) as HTMLInputElement;
  setFps(Number(fpsInput.value));
}

function createSquares() {
  const squaresPerRow = Math.round(Math.sqrt(numberOfSquares));
  const squares: Square[] = [];
  for (let n = 1; n <= numberOfSquares; n++) {
    const row = Math.ceil(n / squaresPerRow);
    const colum = n - (row - 1) * squaresPerRow;
    const x = distance * colum;
    const y = distance * row;
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
  canvas.squares = squares;
}

function measureFps() {
  // Check whether this is the first run
  if (lastT == 0) {
    lastT = performance.now();
    return;
  }
  const t = performance.now();
  const diff = t - lastT;
  measuredFps = Math.round(1000/diff);
  lastT = t;
}

function spinSquares() {
  canvas.squares = canvas.squares.map((square, n) => {
    if (n < numberSpinning) {
      square = { ...square, rotation: square.rotation + 1 };
    }
    return square;
  });
}
  
  
  
  return (
    <div id="input-parameters">
      <label htmlFor="side-length">Side length:</label>
      <input type="number" id="side-length" name="side-length" value={sideLength}/>
      <label htmlFor="num-squares">Number of squares:</label>
      <input type="number" id="num-squares" name="num-squares" value={squaresNumber}/>
      <label htmlFor="num-spinning">Number spinning:</label>
      <input type="number" id="num-spinning" name="num-spinning" value={spinningNumber}/>
      <label htmlFor="req-fps">Frames per sec:</label>
      <input type="number" id="req-fps" name="req-fps" value={fps} />
      <div>
        <button onClick={handleStartButtonClick}>Start</button>
        <button onClick={handleStopButtonClick}>Stop</button>
      </div>
      <p>Measuring: {measuredFps} fps</p>
    </div>
  );
}

export default SidebarInputs;