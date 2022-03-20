import React, { useState, useCallback } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation, key, AnimationName } = props;
  const handleActive = (key) => {
    const name = [...isActive];
    name[key] = key;

    setActive(name);
  };
  return (
    <button
      key={key}
      onClick={() => {
        setAnimation(AnimationName);
        handleActive(key);
      }}
    >
      {AnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
