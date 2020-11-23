import React, { useEffect, useState, useRef }  from 'react';
import { Square } from "./types/types";
import OriginSvg from './origin-svg';
import SquareSvg from './square-svg';

type PanZoomSvgProps = {
  squares: Square[];
}

function PanZoomSvg({squares}: PanZoomSvgProps) {
  const [viewBoxMinX, setViewBoxMinX] = useState(0);
  const [viewBoxMinY, setViewBoxMinY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [zoom, setZoom] = useState(0);
  
  const svgEl = useRef(undefined);
  
  useEffect(() => {
    setViewportSize();
    setViewBoxMin();
    
  }, []);

  function setViewportSize() {
    setViewportWidth(svgEl.current.clientWidth);
    setViewportHeight(svgEl.current.clientHeight);
  }
    
  }

  private setViewBoxMin() {
    const offset = 50;
    this.viewBoxMinX = -offset;
    this.viewBoxMinY = -this.svg.clientHeight + offset;
  }

  get viewboxWidth(): number {
    return this.viewportWidth / this.zoom;
  }

  get viewboxHeight(): number {
    return this.viewportHeight / this.zoom;
  }
  
  return (
    <svg
      ref={svgEl}
      version="1.1"
      width="100%"
      height="100%"
      viewBox="${this.viewBoxMinX} ${this.viewBoxMinY} 
               ${this.viewboxWidth} ${this.viewboxHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
        

        
        <OriginSvg origin={{ x: 0, y: 0 }} size={100} strokeWidth={2}></OriginSvg>
        ${squares.map((square) =>
          squareTemplate(
            square,
            () => this.squareHandlers.mouseEnter(square),
            () => this.squareHandlers.mouseLeave(square),
            (e) => this.squareHandlers.click(e, square),
            (e) => this.squareHandlers.mouseDown(e, square)
          )
        )}
      </svg>
    );
}

export default PanZoomSvg;