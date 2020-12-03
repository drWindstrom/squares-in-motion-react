import React, { useEffect } from "react";
import { store } from "../../app/store";
import { Square } from '../../types/types';
import { actions } from './squareSlice';


let isSquareDrag = false;
let finishingDrag = false;
let lastMousePosition = { x: 0, y: 0 };
let lastUpdate = 0;

export const onSquare = {
  toggleHighlight,
  toggleSelect,
  startDrag,
};

function toggleHighlight(changed: Square) {
  // Handle onMouseEnter and onMouseLeave on square
  if (!isSquareDrag) {
    console.log("Square toggleHighlight");
    store.dispatch(actions.toggleHighlight(changed));
  }
}

function toggleSelect(
  e: React.MouseEvent,
  changed: Square
) {
  // Handle onClick on square
  // Prevent the click event after dragging a square
  // if (finishingDrag) {
  //   finishingDrag = false;
  //   e.stopPropagation();
  //   return;
  // }
  // Regular click to select the square
  console.log("Square toggleSelect");
  e.stopPropagation();
  store.dispatch(actions.toggleSelect(changed));
}

function startDrag(
  e: React.MouseEvent,
  changed: Square,
  svgRef: React.MutableRefObject<SVGSVGElement>
) {
  // Handle onMouseDown on square
  const MAIN_BUTTON = 0;
  if (changed.isSelected && e.button === MAIN_BUTTON) {
    console.log("Square startDrag");
    e.stopPropagation();
    isSquareDrag = true;
    lastMousePosition = clientToSvgCoordinates(e, svgRef);
  }
}


export const onSvg = {
  deselectAll,
  squareDrag: drag,
};

function deselectAll(e: React.MouseEvent) {
  // Handle onClick on svg
  const MAIN_BUTTON = 0;
  if (e.button === MAIN_BUTTON) {
    console.log("Square deselectAll");
    store.dispatch(actions.deselectAll());
  }
}

function drag(
  e: React.MouseEvent,
  svgRef: React.MutableRefObject<SVGSVGElement>
) {
  // Handle onMouseMove on svg
  e.preventDefault();
  e.stopPropagation();
  // Throttle
  if(Date.now() - lastUpdate < 1000/60) { return; }
  lastUpdate = Date.now();
  //Dragging a square
  if (isSquareDrag) {
    console.log("Square drag");
    const mousePosition = clientToSvgCoordinates(e, svgRef);
    const deltaX = mousePosition.x - lastMousePosition.x;
    const deltaY = mousePosition.y - lastMousePosition.y;
    // Translate squares
    store.dispatch(actions.translateSelected({ deltaX, deltaY }));
    // Save last mouse position
    lastMousePosition = mousePosition;
  }
}


export function useSquareWindowHandlers() {
  useEffect(() => {
    // Add event listener
    window.addEventListener('mouseup', finishDrag);
    // Remove event listener
    return () => window.removeEventListener('mouseup', finishDrag);
  }, []);
}

function finishDrag() {
  // Handle onMouseUp on window
  if (isSquareDrag) {
    console.log("Square finishDrag");
    isSquareDrag = false;
    finishingDrag = true;
  }
}

function clientToSvgCoordinates(
  e: React.MouseEvent,
  svgRef: React.MutableRefObject<SVGSVGElement>
) {
  const svgEl = svgRef.current as SVGSVGElement;
  const CTM = svgEl.getScreenCTM();
  const mousePos = { x: 0, y: 0 };
  if (CTM) {
    mousePos.x = (e.clientX - CTM.e) / CTM.a;
    mousePos.y = (e.clientY - CTM.f) / CTM.d;
  }
  return mousePos;
}
