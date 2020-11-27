import React, { useReducer } from "react";
import "./sidebar-inputs";
import SidebarInputs from "./sidebar-inputs";
import './pan-zoom-svg';
import PanZoomSvg from "./pan-zoom-svg";
import {initialSquares, squaresReducer} from './squares-store';

function App() {
  const [squares, dispatch] = useReducer(squaresReducer, initialSquares);
  
  return (
    <div id='squares-in-motion'>
      
      <SidebarInputs
        dispatch={dispatch}
      ></SidebarInputs>
           
      <PanZoomSvg 
        squares={squares}
        dispatch={dispatch}
      ></PanZoomSvg>
    
    </div>
  );
}

export default App;
