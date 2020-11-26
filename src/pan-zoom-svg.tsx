import React, { useEffect, useState, useRef }  from 'react';
import { Square } from "./types/types";
import OriginSvg from './origin-svg';
import SquareSvg from './square-svg';

type PanZoomSvgProps = {
  squares: Square[];
  onSquaresChanged: (squares: Square[]) => void;
}

function PanZoomSvg({squares, onSquaresChanged}: PanZoomSvgProps) {
  //const [viewBoxMinX, setViewBoxMinX] = useState(0);
  //const [viewBoxMinY, setViewBoxMinY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isSquareDrag, setIsSquareDrag] = useState(false);
  const [finishingDrag, setFinishingDrag] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  
  const svgEl = useRef<SVGSVGElement>(undefined!);
    
  useEffect(() => {
    // Get viewport size after initial render and update on resize of the window
    updateSvgViewportSize();
    window.addEventListener('resize', updateSvgViewportSize);

    return () => window.removeEventListener('resize', updateSvgViewportSize);
  }, []);

  useEffect(() => {
    // Set event listener for mouseUp on windows to stop the dragging of squares
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => window.removeEventListener('mouseup', handleWindowMouseUp);
  }, []);

  function updateSvgViewportSize() {
    setViewportWidth(svgEl.current.clientWidth);
    setViewportHeight(svgEl.current.clientHeight);
  }

  const VIEW_BOX_OFFSET = 50;
  const viewBoxMinX = -VIEW_BOX_OFFSET;
  const viewBoxMinY = -viewportHeight + VIEW_BOX_OFFSET;
  
  const viewboxWidth = () => viewportWidth / zoom;
  const viewboxHeight = () => viewportHeight / zoom;

  
  
  function handleSquareMouseEnter(changed: Square) {
    squares = squares.map((square) => {
      if (square === changed) {
        square = { ...square, isHighligted: true };
      }
      return square;
    });
    onSquaresChanged(squares);
  }

  function handleSquareMouseLeave(changed: Square) {
    squares = squares.map((square) => {
      if (square === changed) {
        square = { ...square, isHighligted: false };
      }
      return square;
    });
    onSquaresChanged(squares);
  }

  function handleSquareClick(e: React.MouseEvent<SVGRectElement, MouseEvent>, changed: Square) {
    // Prevent the click event after dragging a square
    if (finishingDrag) {
      setFinishingDrag(false);
      e.stopPropagation();
      return;
    }
    // Regular click to select the square
    e.stopPropagation();
    squares = squares.map((square) => {
      if (square === changed) {
        square = { ...square, isSelected: !square.isSelected };
      }
      return square;
    });
    onSquaresChanged(squares);
  }

  function handleSquareMouseDown(e: React.MouseEvent<SVGRectElement, MouseEvent>, changed: Square) {
    const MAIN_BUTTON = 0;
    if (changed.isSelected && e.button === MAIN_BUTTON) {
      e.stopPropagation();
      setIsSquareDrag(true);
      setLastMousePosition(clientToSvgCoordinates(e));
    }
  }

  function clientToSvgCoordinates(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const CTM = svgEl.current.getScreenCTM();
    const mousePos = { x: 0, y: 0 };
    if (CTM) {
      mousePos.x = (e.clientX - CTM.e) / CTM.a;
      mousePos.y = (e.clientY - CTM.f) / CTM.d;
    }
    return mousePos;
  }

  function handleSvgClick(e: MouseEvent) {
    const MAIN_BUTTON = 0;
    if (e.button === MAIN_BUTTON) {
      // Deselect all squares
      squares = squares.map((square) => {
        return { ...square, isSelected: false };
      });
      onSquaresChanged(squares);
    }
  }

  function handleSvgMouseMove(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    // Throttle
    // if(Date.now() - this.lastUpdate < 1000/30) {
    //   return;
    // }
    // this.lastUpdate = Date.now();
    // Dragging a square
    if (isSquareDrag) {
      const mousePosition = clientToSvgCoordinates(e);
      const deltaX = mousePosition.x - lastMousePosition.x;
      const deltaY = mousePosition.y - lastMousePosition.y;
      // Move slected squares to the next position
      squares = squares.map((square) => {
        if (square.isSelected) {
          square = {
            ...square,
            x: square.x + deltaX,
            y: square.y + deltaY,
          };
        }
        return square;
      });
      onSquaresChanged(squares);
      // Save last mouse position
      setLastMousePosition(mousePosition);
    }
  }

  function handleWindowMouseUp() {
    if (isSquareDrag) {
      setIsSquareDrag(false);
      setFinishingDrag(true);
    }
  }


  const squareItems = squares.map((square) =>
    <SquareSvg 
      square={square} 
      onMouseEnter={() => handleSquareMouseEnter(square)}
      onMouseLeave={() => handleSquareMouseLeave(square)}
      onClick={(e) => handleSquareClick(e, square)}
      onMouseDown={(e) => handleSquareMouseDown(e, square)}
      key={square.id} 
    ></SquareSvg>
  );
  
  return (
    <svg
      ref={svgEl}
      version="1.1"
      width="100%"
      height="100%"
      viewBox={`${viewBoxMinX} ${viewBoxMinY} ${viewboxWidth()} ${viewboxHeight()}`}
      xmlns="http://www.w3.org/2000/svg"
      onMouseMove={handleSvgMouseMove}
    >
      <OriginSvg origin={{ x: 0, y: 0 }} size={100} strokeWidth={2}></OriginSvg>
      {squareItems}
    </svg>
  );  
}

export default PanZoomSvg;