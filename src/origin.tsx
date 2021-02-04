import React from 'react';
import './origin.css';

type OriginProps = {
  origin: { x: number; y: number };
  size: number;
  strokeWidth: number;
};

function Origin({ origin, size, strokeWidth }: OriginProps) {
  const markerSize = 3 * strokeWidth;

  const xArrow = { x: origin.x + size, y: -origin.y };
  const yArrow = { x: origin.x, y: -(origin.y + size) };

  const xLabel = {
    x: xArrow.x - 4 * markerSize,
    y: xArrow.y + 3 * markerSize,
  };
  const yLabel = {
    x: yArrow.x - 3 * markerSize,
    y: yArrow.y + 4 * markerSize,
  };

  const invOrigin = { x: origin.x, y: -origin.y };

  return (
    <g>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth={markerSize}
        markerHeight={markerSize}
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
      <path
        d={`M ${yArrow.x} ${yArrow.y} 
            L ${invOrigin.x} ${invOrigin.y} 
            L ${xArrow.x} ${xArrow.y}`}
        stroke="black"
        strokeWidth={strokeWidth}
        fill="none"
        markerStart="url(#arrow)"
        markerEnd="url(#arrow)"
      />
      <text x={xLabel.x} y={xLabel.y}>
        X
      </text>
      <text x={yLabel.x} y={yLabel.y}>
        Y
      </text>
    </g>
  );
}

export default Origin;
