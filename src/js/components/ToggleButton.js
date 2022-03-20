import React, { useState, useCallback } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation, key, setAnimationName } = props;
  const handleActive = (i) => {
    const temp = [...isActive];
    console.log("Active State:", (temp[i] = !temp[i]));
    temp[i] = !temp[i];
    setActive(temp);
  };
  return (
    <button
      key={key}
      onClick={() => {
        setAnimation(setAnimationName);
        handleActive(key);
      }}
    >
      {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
