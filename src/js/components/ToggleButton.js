import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    isActive,
    setActive,
    setCondition,
    condition,
    setAnimation,
    setAnimationName,
    key,
  } = props;

  return (
    <button
      key={key}
      onClick={() => {
        setAnimation(setAnimationName);
        setActive(`${condition === key ? !isActive : ""}`);
      }}
    >
      {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
