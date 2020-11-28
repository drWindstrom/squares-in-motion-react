import React from 'react';
import PanZoomSvg from './pan-zoom-svg';
import SidebarInputs from './sidebar-inputs';


function App() {
    
  return (
    <div id='squares-in-motion'>
      <SidebarInputs></SidebarInputs>
      <PanZoomSvg></PanZoomSvg>
    </div>
  );
}

export default App;
