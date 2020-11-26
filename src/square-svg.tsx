import React from "react";
import { invertYAxis } from "./utils";
import { Square } from "./types/types";

type SquareProps = {
  square: Square;
  onMouseEnter: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
  onMouseLeave: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
  onClick: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
  onMouseDown: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
};

function SquareSvg({
  square,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onMouseDown,
}: SquareProps) {
  // Default style
  let strokeColor = "black";
  let strokeWidth = "0";
  let cursorStyle = "grab";
  if (square.isHighligted && !square.isSelected) {
    // Highlighted only
    strokeColor = "rgb(85,160,185)";
    strokeWidth = "2";
  } else if (square.isSelected && !square.isHighligted) {
    // Selected only
    strokeColor = "rgb(175,35,95)";
    strokeWidth = "2";
  } else if (square.isSelected && square.isHighligted) {
    // Highlighted and selected
    strokeColor = "rgb(175,35,95)";
    strokeWidth = "2";
    cursorStyle = "move";
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onMouseDown={onMouseDown}
    ></rect>
  );
}

export default SquareSvg;
