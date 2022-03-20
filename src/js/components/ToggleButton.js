import React, { useState, useCallback } from "react";
export const ToggleButton = (state, props) => {
  const { isActive, setActive, key, setAnimation, setAnimationName } = props;

  const toggleButton = useCallback((key) => setActive((key) => key), [
    isActive,
  ]);

  return (
    <button
      onClick={() => {
        setAnimation(setAnimationName);
        // setActive(!isActive);

        toggleButton(isActive);
      }}
    >
      {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
