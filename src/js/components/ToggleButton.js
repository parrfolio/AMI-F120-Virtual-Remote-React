import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimation,
    setAnimationName,
    toggleActive,
    index,
    setRunning,
    appState,
    isRunning,
    isActiveIndex,
  } = props;

  let running = isActiveIndex === index;

  return (
    <button
      key={index}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleActive(index);
        setRunning(!running);
      }}
    >
      Name: {setAnimationName} {isRunning ? "active" : "inactive"}
    </button>
  );
};
