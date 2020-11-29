import React, { useEffect, useState, useRef } from "react";
import OriginSvg from "./origin-svg";
import SquareSvg from "./features/square/square-svg";
import { useSelector } from 'react-redux';
import { selectSquares } from "./features/square/squareSlice";
import { useSquareWindowHandlers, onSvg  } from './features/square/square-handler';

function PanZoomSvg() {
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [zoom, setZoom] = useState(1);
  
  const svgRef = useRef<SVGSVGElement>(undefined!);

  useSquareWindowHandlers();
  
  const squares = useSelector(selectSquares);

  useEffect(() => {
    // Get viewport size after initial render and update on resize of the window
    function updateSvgViewportSize() {
      setViewportWidth(svgRef.current.clientWidth);
      setViewportHeight(svgRef.current.clientHeight);
    }

    updateSvgViewportSize();
    window.addEventListener("resize", updateSvgViewportSize);

    return () => window.removeEventListener("resize", updateSvgViewportSize);
  }, []);
  
  const VIEW_BOX_OFFSET = 50;
  const viewBoxMinX = -VIEW_BOX_OFFSET;
  const viewBoxMinY = -viewportHeight + VIEW_BOX_OFFSET;
  const viewboxWidth = viewportWidth / zoom;
  const viewboxHeight = viewportHeight / zoom;

  const squareItems = squares.map((square) => (
    <SquareSvg
      square={square}
      svgRef={svgRef}
      key={square.id}
    ></SquareSvg>
  ));

  return (
    <svg
      ref={svgRef}
      version="1.1"
      width="100%"
      height="100%"
      viewBox={`${viewBoxMinX} ${viewBoxMinY} ${viewboxWidth} ${viewboxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    >
      <OriginSvg origin={{ x: 0, y: 0 }} size={100} strokeWidth={2}></OriginSvg>
      {squareItems}
    </svg>
  );

  function handleClick(e: React.MouseEvent<SVGElement, MouseEvent>) {
    onSvg.deselectAll(e);
  }
  
  function handleMouseMove(e: React.MouseEvent<SVGElement, MouseEvent>) {
    onSvg.squareDrag(e, svgRef);
  }
}



export default PanZoomSvg;
