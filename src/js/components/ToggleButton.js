import React, { useState } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation, key, setAnimationName } = props;
  console.log(key);
  return (
    <button
      onClick={() => {
        setAnimation(setAnimationName);
        setActive(!isActive);
      }}
    >
      {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
