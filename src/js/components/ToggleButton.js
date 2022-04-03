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
      Name: {setAnimationName} {!running ? "active" : "inactive"}
    </button>
  );
};
