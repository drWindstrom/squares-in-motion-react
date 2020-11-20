import React from "react";

export function Rectangle(props: {width: number; height: number}) {
  return (
    <rect
      x="10"
      y="10"
      width={props.width}
      height={props.height}
      stroke="black"
      fill="transparent"
      stroke-width="5"
    />
  );
}
