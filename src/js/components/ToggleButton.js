import React, { useState } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation, setAnimationName } = props;
  const toggleClass = () => {
    setActive(!isActive);
  };
  return (
    <button
      className={isActive}
      onClick={() => {
        setAnimation(setAnimationName);
        toggleClass();
      }}
    >
      New Rainbow {isActive ? "On" : "Off"}
    </button>
  );
};
