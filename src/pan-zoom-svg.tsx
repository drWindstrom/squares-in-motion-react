import React, { useEffect, useState, useRef } from 'react';
import OriginSvg from './origin';
import SquareSvg from './square';
import { Square, PayloadAction } from './store';

type PanZoomSvgProps = {
  squares: Square[];
  dispatch: React.Dispatch<PayloadAction>;
};

function PanZoomSvg({ squares, dispatch }: PanZoomSvgProps) {
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [zoom, setZoom] = useState(1);

  const svgRef = useRef<SVGSVGElement>(undefined!);

  useEffect(() => {
    // Get viewport size after initial render and update on resize of the window
    function updateSvgViewportSize() {
      setViewportWidth(svgRef.current.clientWidth);
      setViewportHeight(svgRef.current.clientHeight);
    }

    updateSvgViewportSize();
    window.addEventListener('resize', updateSvgViewportSize);

    return () => window.removeEventListener('resize', updateSvgViewportSize);
  }, []);

  const VIEW_BOX_OFFSET = 50;
  const viewBoxMinX = -VIEW_BOX_OFFSET;
  const viewBoxMinY = -viewportHeight + VIEW_BOX_OFFSET;
  const viewboxWidth = viewportWidth / zoom;
  const viewboxHeight = viewportHeight / zoom;

  const squareItems = squares.map(square => (
    <SquareSvg square={square} svgRef={svgRef} key={square.id} />
  ));

  return (
    <svg
      ref={svgRef}
      version="1.1"
      width="100%"
      height="100%"
      viewBox={`${viewBoxMinX} ${viewBoxMinY} ${viewboxWidth} ${viewboxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <OriginSvg origin={{ x: 0, y: 0 }} size={100} strokeWidth={2}></OriginSvg>
      {squareItems}
    </svg>
  );
}

export default PanZoomSvg;
