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
  } = props;

  return (
    <button
      key={index}
      onClick={() => {
        console.log("TOGGLE BUTTON Index", index);
        setAnimation(setAnimationName);
        toggleActive(index, setRunning(!isRunning));
        toggleActiveButton(index, setRunning(!isRunning));
      }}
    >
      Name: {setAnimationName} {toggleActiveStyle(index)}
    </button>
  );
};
