import React, { useState } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation, setAnimationName } = props;

  return (
    <button
      onClick={() => {
        setAnimation(setAnimationName);
        setActive(!isActive);
      }}
    >
      New Rainbow {isActive ? "On" : "Off"}
    </button>
  );
};
