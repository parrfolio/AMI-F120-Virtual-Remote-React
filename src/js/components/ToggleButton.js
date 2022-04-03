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

  console.log("IS RUNNING TOGGLE", isRunning);

  return (
    <button
      key={index}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleActive(index);
        setRunning(running === false ? true : false);
      }}
    >
      Name: {setAnimationName} {isRunning ? "active" : "inactive"}
    </button>
  );
};
