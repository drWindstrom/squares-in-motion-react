import React from 'react';
import { invertYAxis } from './utils';
import { Square } from './types/types';
import { onSquare } from './features/square/square-handler';

type SquareProps = {
  square: Square;
  svgRef: React.MutableRefObject<SVGSVGElement>;
};

function SquareSvg({ square, svgRef }: SquareProps) {
  // Default style
  let strokeColor = 'black';
  let strokeWidth = '0';
  let cursorStyle = 'grab';
  if (square.isHighligted && !square.isSelected) {
    // Highlighted only
    strokeColor = 'rgb(85,160,185)';
    strokeWidth = '2';
  } else if (square.isSelected && !square.isHighligted) {
    // Selected only
    strokeColor = 'rgb(175,35,95)';
    strokeWidth = '2';
  } else if (square.isSelected && square.isHighligted) {
    // Highlighted and selected
    strokeColor = 'rgb(175,35,95)';
    strokeWidth = '2';
    cursorStyle = 'move';
  }

  const center = invertYAxis({ x: square.x, y: square.y });

  return (
    <rect
      x={-square.sideLength / 2}
      y={-square.sideLength / 2}
      width={square.sideLength}
      height={square.sideLength}
      rx={square.sideLength / 10}
      ry={square.sideLength / 10}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      cursor={cursorStyle}
      transform={`translate(${center.x} ${center.y}) rotate(${square.rotation})`}
      onMouseEnter={() => onSquare.toggleHighlight(square)}
      onMouseLeave={() => onSquare.toggleHighlight(square)}
      onClick={toggleSelect}
      onMouseDown={startDrag}
    ></rect>
  );

  function toggleSelect(e: React.MouseEvent<SVGRectElement, MouseEvent>) {
    onSquare.toggleSelect(e, square);
  }

  function startDrag(e: React.MouseEvent<SVGRectElement, MouseEvent>) {
    onSquare.startDrag(e, square, svgRef);
  }
}

export default SquareSvg;
