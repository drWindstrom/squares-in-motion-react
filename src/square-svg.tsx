import React, { useState } from 'react';
import { Square } from './store';

type SquareSvgProps = {
  square: Square;
  svgRef: React.MutableRefObject<SVGSVGElement>;
};

function SquareSvg({ square, svgRef }: SquareSvgProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Default style
  let strokeColor = 'black';
  let strokeWidth = '0';
  let cursorStyle = 'grab';
  if (isHighlighted && !square.isSelected) {
    // Highlighted only
    strokeColor = 'rgb(85,160,185)';
    strokeWidth = '2';
  } else if (square.isSelected && !isHighlighted) {
    // Selected only
    strokeColor = 'rgb(175,35,95)';
    strokeWidth = '2';
  } else if (square.isSelected && isHighlighted) {
    // Highlighted and selected
    strokeColor = 'rgb(175,35,95)';
    strokeWidth = '2';
    cursorStyle = 'move';
  }

  const center = { x: square.x, y: -square.y };

  function handlePointerEnter() {
    setIsHighlighted(true);
  }

  function handlePointerLeave() {
    setIsHighlighted(false);
  }

  return (
    <rect
      x={-square.sideLength / 2}
      y={-square.sideLength / 2}
      width={square.sideLength}
      height={square.sideLength}
      rx={square.sideLength / 10}
      ry={square.sideLength / 10}
      stroke={strokeColor}
      stroke-width={strokeWidth}
      cursor={cursorStyle}
      transform={`translate(${center.x} ${center.y}) rotate(${square.rotation})`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    ></rect>
  );
}

export default SquareSvg;
