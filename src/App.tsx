import React, { useReducer } from 'react';
import PanZoomSvg from './pan-zoom-svg';
import Sidebar from './sidebar';
import { squareReducer, initialState } from './store';

function App() {
  const [squares, dispatch] = useReducer(squareReducer, initialState);

  return (
    <main>
      <Sidebar dispatch={dispatch} />
      <PanZoomSvg squares={squares} dispatch={dispatch} />
    </main>
  );
}

export default App;
