import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimation,
    setAnimationName,
    toggleActive,
    index,
    toggleActiveButton,
    toggleActiveStyle,
    appState,
    setRunning,
    isRunning,
    isActiveIndex,
  } = props;

  return (
    <button
      key={index}
      onClick={() => {
        console.log("TOGGLE BUTTON Index", index);
        setAnimation(setAnimationName);
        toggleActive(index, setRunning(isRunning ? false : true));
        //toggleActiveButton(index, setRunning(!isRunning));
      }}
    >
      Name: {setAnimationName} {isActiveIndex === index ? "active" : "inactive"}
    </button>
  );
};
