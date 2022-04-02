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
        console.log("TOGGLE BUTTON Index", index);
        setAnimation(setAnimationName);
        toggleActive(index, setRunning(isActiveIndex === index ? true : false));
      }}
    >
      Name: {setAnimationName} {isActiveIndex === index ? "active" : "inactive"}
    </button>
  );
};
