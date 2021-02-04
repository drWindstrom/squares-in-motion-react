import React, { useState } from 'react';
import { PayloadAction } from './store';

let lastT = 0;
let intervalId: NodeJS.Timeout | undefined = undefined;
let fpsList: number[] = [];

type SidebarProps = {
  dispatch: React.Dispatch<PayloadAction>;
};

function Sidebar({ dispatch }: SidebarProps) {
  const [sideLength, setSideLength] = useState(40);
  const [numberOfSquares, setNumberOfSquares] = useState(100);
  const [numberSpinning, setNumberSpinning] = useState(0);
  const [requestedFps, setRequestedFps] = useState(30);
  const [lastFrameFps, setLastFrameFps] = useState(0);

  function createSquares() {
    dispatch({
      type: 'create',
      payload: {
        numberOfSquares,
        sideLength,
      },
    });
  }

  function stopSpinning() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
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
    fpsList.push(frameFps);
    // Save current time stamp for next run
    lastT = t;
  }

  function handleStartButtonClick() {
    fpsList = [];
    setLastFrameFps(0);

    createSquares();
    stopSpinning();

    if (numberSpinning > 0) {
      intervalId = setInterval(() => {
        measureFps();
        dispatch({ type: 'rotate', payload: { numberSpinning } });
      }, 1000 / requestedFps);
    }
  }

  function handleStopButtonClick() {
    stopSpinning();
  }

  function average(list: number[], subsetSize = 0) {
    if (list.length === 0 || list.length < subsetSize) {
      return 0;
    }

    const summer = (acc: number, current: number) => acc + current;
    if (subsetSize === 0) {
      const sum = list.reduce(summer);
      return Math.round(sum / list.length);
    } else {
      const lastItems = list.slice(list.length - subsetSize);
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
        onChange={e => setSideLength(Number(e.target.value))}
      />
      <label htmlFor="num-squares">Number of squares:</label>
      <input
        type="number"
        id="num-squares"
        name="num-squares"
        defaultValue={numberOfSquares}
        onChange={e => setNumberOfSquares(Number(e.target.value))}
      />
      <label htmlFor="num-spinning">Number spinning:</label>
      <input
        type="number"
        id="num-spinning"
        name="num-spinning"
        defaultValue={numberSpinning}
        onChange={e => setNumberSpinning(Number(e.target.value))}
      />
      <label htmlFor="req-fps">Frames per sec:</label>
      <input
        type="number"
        id="req-fps"
        name="req-fps"
        defaultValue={requestedFps}
        onChange={e => setRequestedFps(Number(e.target.value))}
      />
      <div>
        <button onClick={handleStartButtonClick}>Start</button>
        <button onClick={handleStopButtonClick}>Stop</button>
      </div>
      <p>Last frame: {lastFrameFps} fps</p>
      <p>Last 30 frames: {average(fpsList, 30)} fps</p>
      <p>All frames: {average(fpsList)} fps</p>
    </div>
  );
}

export default Sidebar;
