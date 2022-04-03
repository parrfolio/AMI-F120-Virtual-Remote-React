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

  console.log("IS RUNNING STATE IN TOGGLE", isRunning);

  return (
    <button
      key={index}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleActive(index, setAnimationName);
        setRunning(!isRunning);
      }}
    >
      {setAnimationName} Lights {isRunning && running ? "on" : "off"}
    </button>
  );
};
