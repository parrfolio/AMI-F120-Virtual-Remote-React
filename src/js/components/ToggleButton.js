import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimation,
    setAnimationName,
    toggleActive,
    index,
    setRunning,
    appState,
    isActiveIndex,
  } = props;

  return (
    <button
      key={index}
      onClick={() => {
        let running = isActiveIndex === index;
        setAnimation(setAnimationName);
        toggleActive(index);
        console.log("Running?", running);
        setRunning(!running);
      }}
    >
      Name: {setAnimationName} {isActiveIndex === index ? "active" : "inactive"}
    </button>
  );
};
