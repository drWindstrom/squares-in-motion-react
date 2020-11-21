import React, { useState } from "react";
import "./sidebar-inputs";
import SidebarInputs from "./sidebar-inputs";
import { Square } from "./types/types";

function App() {
  const [squares, setSquares] = useState<Square[]>([]);

  function handleSquaresChanged(squares: Square[]) {
    setSquares(squares);
  }

  return (
    <div>
      <SidebarInputs
        squares={squares}
        onSquaresChanged={handleSquaresChanged}
      ></SidebarInputs>
      {/* <pan-zoom-svg></pan-zoom-svg> */}
    </div>
  );
}

export default App;
