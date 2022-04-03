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

  let running = isActiveIndex === index && isRunning;

  return (
    <button
      key={index}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleActive(index);
        setRunning(running ? true : false);
      }}
    >
      Name: {setAnimationName} {isRunning ? "active" : "inactive"}
    </button>
  );
};
