import React, { useState, useCallback } from "react";
export const ToggleButton = (props) => {
  const {
    isActive,
    setActive,
    setAnimation,
    key,
    setAnimationName,
    toggledButtonId,
    setToggledButtonId,
  } = props;
  console.log(key);

  const toggleButton = useCallback((id) => setToggledButtonId((state) => id), [
    toggledButtonId,
  ]);

  const isToggled = key === toggledButtonId;

  return (
    <button
      onClick={() => {
        setAnimation(setAnimationName);
        setActive(!isActive);
        toggleButton(key);
      }}
    >
      {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
