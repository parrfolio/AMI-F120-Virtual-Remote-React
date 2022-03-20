import React, { useState, useCallback } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation, key, setAnimationName } = props;

  return (
    <button
      key={key}
      onClick={() => {
        setAnimation(setAnimationName);
        setActive(!isActive);
      }}
    >
      {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
