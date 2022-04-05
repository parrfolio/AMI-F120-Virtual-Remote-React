import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimationName,
    toggleActive,
    index,
    setRunning,
    isRunning,
    isActiveIndex,
  } = props;

  let running = isActiveIndex === index;

  return (
    <button
      key={index}
      className={isRunning ? "on" : "off"}
      onClick={() => {
        toggleActive(index);
        setRunning(!isRunning);
      }}
    >
      {setAnimationName} Lights {isRunning ? "on" : "off"}
    </button>
  );
};
