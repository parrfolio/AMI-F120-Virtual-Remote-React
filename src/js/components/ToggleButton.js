import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimation,
    setAnimationName,
    toggleActive,
    index,
    appState,
  } = props;

  return (
    <button
      key={index}
      onClick={() => {
        console.log("TOGGLE BUTTON Index", index);
        setAnimation(setAnimationName);
        toggleActive(index);
      }}
    >
      Name: {setAnimationName} {appState.lastObject ? "On" : "Off"}
    </button>
  );
};
