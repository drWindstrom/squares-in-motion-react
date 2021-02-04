import React, { useState } from 'react';
import { Square, PayloadAction } from './store';

let hasDragStarted = false;
let isDrag = false;
let lastMousePosition = { x: 0, y: 0 };
let lastUpdate = 0;

type SquareSvgProps = {
  square: Square;
  dispatch: React.Dispatch<PayloadAction>;
  svgRef: React.MutableRefObject<SVGSVGElement>;
};

function SquareSvg({ square, dispatch, svgRef }: SquareSvgProps) {
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

  function startDrag(e: React.PointerEvent) {
    e.stopPropagation();
    const MAIN_BUTTON = 0;
    if (e.button === MAIN_BUTTON && square.isSelected === true) {
      hasDragStarted = true;
      const dragElement = e.target as HTMLDivElement;
      dragElement.setPointerCapture(e.pointerId);
      lastMousePosition = clientToSvgCoordinates(e);
    }
  }

  function clientToSvgCoordinates(e: React.MouseEvent) {
    const svgEl = svgRef.current as SVGSVGElement;
    const CTM = svgEl.getScreenCTM();
    const mousePos = { x: 0, y: 0 };
    if (CTM) {
      mousePos.x = (e.clientX - CTM.e) / CTM.a;
      mousePos.y = (e.clientY - CTM.f) / CTM.d;
    }
    return mousePos;
  }

  function dragging(e: React.PointerEvent) {
    // Throttle
    if (Date.now() - lastUpdate < 1000 / 60) {
      return;
    }
    lastUpdate = Date.now();
    // Handle dragging of square
    if (hasDragStarted === true) {
      e.stopPropagation();
      isDrag = true;
      const mousePosition = clientToSvgCoordinates(e);
      const deltaX = mousePosition.x - lastMousePosition.x;
      const deltaY = mousePosition.y - lastMousePosition.y;
      // Translate squares
      dispatch({
        type: 'translate',
        payload: {
          deltaX,
          deltaY,
        },
      });
      // Save last mouse position
      lastMousePosition = mousePosition;
    }
  }

  function stopDrag(e: React.PointerEvent) {
    const dragElement = e.target as HTMLDivElement;
    dragElement.releasePointerCapture(e.pointerId);
    isDrag = false;
    hasDragStarted = false;
  }

  function toggleSelect() {
    dispatch({
      type: 'select',
      payload: {
        squareId: square.id,
      },
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    const MAIN_BUTTON = 0;
    if (e.button !== MAIN_BUTTON) {
      return;
    }

    e.stopPropagation();

    if (isDrag === false) {
      toggleSelect();
    }
    stopDrag(e);
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
      strokeWidth={strokeWidth}
      cursor={cursorStyle}
      transform={`translate(${center.x} ${center.y}) rotate(${square.rotation})`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={startDrag}
      onPointerMove={dragging}
      onPointerUp={handlePointerUp}
    ></rect>
  );
}

export default SquareSvg;
