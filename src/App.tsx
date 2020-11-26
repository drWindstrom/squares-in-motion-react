import React, { useState } from "react";
import "./sidebar-inputs";
import SidebarInputs from "./sidebar-inputs";
import { Square } from "./types/types";
import './pan-zoom-svg';
import PanZoomSvg from "./pan-zoom-svg";

function App() {
  const [squares, setSquares] = useState<Square[]>([]);

  function handleSquaresChanged(nextSquares: Square[]) {
    setSquares(nextSquares);
  }

  return (
    <div id='squares-in-motion'>
      <SidebarInputs
        squares={squares}
        onSquaresChanged={handleSquaresChanged}
      ></SidebarInputs>
           
      <PanZoomSvg 
        squares={squares}
        onSquaresChanged={handleSquaresChanged}
      ></PanZoomSvg>
    </div>
  );
}

export default App;
