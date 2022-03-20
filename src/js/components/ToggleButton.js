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

  const isToggled = key === toggledButtonId;

  return (
    <button
      key={key}
      onClick={() => {
        setAnimation(setAnimationName);
        setActive(!isActive);
        toggleButton(key);
      }}
    >
      {isToggled}
      {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
