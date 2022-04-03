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
  setRunning(false);

  return (
    <button
      key={index}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleActive(index);
        setRunning(!isRunning);
      }}
    >
      {console.log("IS RUNNING", isRunning)}
      {console.log("Match", running)}
      {setAnimationName} Lights {isRunning && running ? "off" : "on"}
    </button>
  );
};
