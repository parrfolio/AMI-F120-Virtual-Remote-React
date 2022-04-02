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

  return (
    <button
      key={index}
      onClick={() => {
        console.log("IS Running", isActiveIndex === index);
        let running = isActiveIndex === index;
        console.log("TOGGLE BUTTON Index", index);
        setAnimation(setAnimationName);
        toggleActive(index, running);
      }}
    >
      Name: {setAnimationName} {isActiveIndex === index ? "active" : "inactive"}
    </button>
  );
};
