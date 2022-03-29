import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimation,
    setAnimationName,
    toggleActive,
    index,
    toggleActiveButton,
  } = props;

  return (
    <button
      key={index}
      onClick={() => {
        console.log("TOGGLE BUTTON Index", index);
        setAnimation(setAnimationName);
        toggleActive(index);
        // toggleActiveButton(index);
      }}
    >
      Name: {setAnimationName} {toggleActive ? "On" : "Off"}
    </button>
  );
};
