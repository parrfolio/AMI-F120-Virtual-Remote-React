import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    isActive,
    setActive,
    setAnimation,
    setAnimationName,
    toggleActive,
    index,
  } = props;

  return (
    <button
      key={index}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleActive(index);
      }}
    >
      Name: {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
