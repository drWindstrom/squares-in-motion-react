import React, { useEffect, useState, useRef } from 'react';
import Origin from './origin';
import SquareSvg from './square-svg';
import { Square, PayloadAction } from './store';

let isPan = false;
let lastMousePosition = { x: 0, y: 0 };

type PanZoomSvgProps = {
  squares: Square[];
  dispatch: React.Dispatch<PayloadAction>;
};

function PanZoomSvg({ squares, dispatch }: PanZoomSvgProps) {
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const svgRef = useRef<SVGSVGElement>(undefined!);
  const [viewBoxMinX, setViewBoxMinX] = useState(0);
  const [viewBoxMinY, setViewBoxMinY] = useState(0);
  const ORIGIN_OFFSET = 32;

  useEffect(() => {
    // Get viewport size after initial render and update on resize of the window
    function setViewportSize() {
      setViewportWidth(svgRef.current.clientWidth);
      setViewportHeight(svgRef.current.clientHeight);
    }

    setViewportSize();
    setViewBoxMinX(-ORIGIN_OFFSET);
    setViewBoxMinY(-svgRef.current.clientHeight + ORIGIN_OFFSET);
    // Add event to adjust the viewport size if the window is resized
    window.addEventListener('resize', setViewportSize);

    return () => window.removeEventListener('resize', setViewportSize);
  }, []);

  const [zoom, setZoom] = useState(1);
  const viewboxWidth = viewportWidth / zoom;
  const viewboxHeight = viewportHeight / zoom;

  function handleZoom(e: React.WheelEvent) {
    // Determine new zoom level
    let zoomFactor: number;
    if (e.deltaY < 0) {
      zoomFactor = 0.9;
    } else {
      zoomFactor = 1 / 0.9;
    }
    const newZoom = zoom * zoomFactor;
    // Determine pointer location relative to svg element
    const svgBBox = svgRef.current.getBoundingClientRect();
    const offsetX = e.clientX - svgBBox.left;
    const offsetY = e.clientY - svgBBox.top;
    // Convert pointer location into SVG viewport coordinates
    const xBeforeZoom = offsetX / zoom;
    const yBeforeZoom = offsetY / zoom;
    // Determine pointer location after the zoom
    const xAfterZoom = offsetX / newZoom;
    const yAfterZoom = offsetY / newZoom;
    // Determine SVG image shift due to zoom
    const deltaX = xBeforeZoom - xAfterZoom;
    const deltaY = yBeforeZoom - yAfterZoom;
    // Translate SVG viewport to prevent the SVG image shift
    setViewBoxMinX(viewBoxMinX + deltaX);
    setViewBoxMinY(viewBoxMinY + deltaY);
    // Set new zoom level
    setZoom(newZoom);
  }

  function startPan(e: React.PointerEvent) {
    e.preventDefault();
    const WHEEL_BUTTON = 1;
    if (e.button === WHEEL_BUTTON) {
      const dragElement = e.target as Element;
      dragElement.setPointerCapture(e.pointerId);
      isPan = true;
      // Save mouse position
      lastMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  }

  function panning(e: React.PointerEvent) {
    e.preventDefault();
    if (isPan) {
      const mousePosition = { x: e.clientX, y: e.clientY };
      const deltaX = (mousePosition.x - lastMousePosition.x) / zoom;
      const deltaY = (mousePosition.y - lastMousePosition.y) / zoom;
      setViewBoxMinX(viewBoxMinX - deltaX);
      setViewBoxMinY(viewBoxMinY - deltaY);
      // Save mouse position
      lastMousePosition = mousePosition;
    }
  }

  function stopPan(e: React.PointerEvent) {
    e.preventDefault();
    const dragElement = e.target as Element;
    dragElement.releasePointerCapture(e.pointerId);
    isPan = false;
  }

  function deselectAll(e: React.PointerEvent) {
    // Handle onPointerdown
    const MAIN_BUTTON = 0;
    if (e.button === MAIN_BUTTON) {
      dispatch({
        type: 'deselectAll',
        payload: undefined,
      });
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    startPan(e);
    deselectAll(e);
  }

  const squareItems = squares.map(square => (
    <SquareSvg
      square={square}
      dispatch={dispatch}
      svgRef={svgRef}
      key={square.id}
    />
  ));

  return (
    <svg
      version="1.1"
      width="100%"
      height="100%"
      viewBox={`${viewBoxMinX} ${viewBoxMinY} ${viewboxWidth} ${viewboxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      onWheel={handleZoom}
      onPointerDown={handlePointerDown}
      onPointerMove={panning}
      onPointerUp={stopPan}
    >
      <Origin origin={{ x: 0, y: 0 }} size={100} strokeWidth={2}></Origin>
      {squareItems}
    </svg>
  );
}

export default PanZoomSvg;
