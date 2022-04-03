import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimation,
    setAnimationName,
    toggleActive,
    index,
    setRunning,
    isRunning,
    appState,
    isActiveIndex,
  } = props;

  // let running = isActiveIndex === index;

  return (
    <button
      key={index}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleActive(index);
      }}
    >
      Name: {setAnimationName} {isRunning ? "active" : "inactive"}
    </button>
  );
};
