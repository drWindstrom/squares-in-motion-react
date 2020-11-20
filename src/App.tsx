import React from "react";
import { Example } from "./example";
import {Rectangle } from "./rectangle";

function App() {
  const age = 19;
  return (
    <div>
      <p>My age: {age}</p>
      <Example></Example>
      <svg
        version="1.1"
        baseProfile="full"
        width="300"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Rectangle width={100} height={100}></Rectangle>
      </svg>
    </div>
  );
}

export default App;
