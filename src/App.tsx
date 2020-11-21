import React, { useState } from "react";
import "./sidebar-inputs";
import SidebarInputs from "./sidebar-inputs";
import { Square } from "./types/types";

function App() {
  const [squares, setSquares] = useState<Square[]>([]);

  function handleSquaresChanged(nextSquares: Square[]) {
    setSquares(nextSquares);
  }

  return (
    <div>
      <SidebarInputs
        squares={squares}
        onSquaresChanged={handleSquaresChanged}
      ></SidebarInputs>
      <p>Angle: {squares.length > 0 ? squares[0].rotation : undefined } deg</p>
      
      {/* <pan-zoom-svg></pan-zoom-svg> */}
    </div>
  );
}

export default App;
