import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimation,
    setAnimationName,
    toggleActive,
    buttonIndex,
    toggleActiveButton,
  } = props;

  return (
    <button
      key={buttonIndex}
      onClick={() => {
        console.log("TOGGLE BUTTON Index", buttonIndex);
        setAnimation(setAnimationName);
        toggleActive(buttonIndex);
        // toggleActiveButton(index);
      }}
    >
      Name: {setAnimationName} {toggleActive ? "On" : "Off"}
    </button>
  );
};
