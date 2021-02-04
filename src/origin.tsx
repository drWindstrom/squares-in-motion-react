import React from 'react';
import { Point } from './utils';
import { invertYAxis } from './utils';

type Props = {
  origin: Point;
  size: number;
  strokeWidth: number;
};

function OriginSvg({ origin, size, strokeWidth }: Props) {
  const markerSize = 3 * strokeWidth;
  let xArrow = { x: origin.x + size, y: origin.y };
  let yArrow = { x: origin.x, y: origin.y + size };
  let xLabel = { x: xArrow.x - 4 * markerSize, y: xArrow.y - 3 * markerSize };
  let yLabel = { x: yArrow.x - 3 * markerSize, y: yArrow.y - 4 * markerSize };
  // Invert y-axis
  xArrow = invertYAxis(xArrow);
  yArrow = invertYAxis(yArrow);
  xLabel = invertYAxis(xLabel);
  yLabel = invertYAxis(yLabel);
  const invOrigin = invertYAxis(origin);

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

export default OriginSvg;
