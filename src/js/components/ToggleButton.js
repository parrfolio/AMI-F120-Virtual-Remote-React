import React, { useState } from "react";
export const ToggleButton = (props) => {
  const {
    setAnimationName,
    toggleActive,
    index,
    setRunning,
    isRunning,
    isActiveIndex,
    setIndex,
    isIndex,
  } = props;

  return (
    <button
      key={index}
      className={isRunning && isActiveIndex === isIndex ? "on" : "off"}
      onClick={() => {
        toggleActive(index);
        setRunning(!isRunning);
        setIndex(index);
      }}
    >
      {setAnimationName} Lights{" "}
      {isRunning && isActiveIndex === isIndex ? "on" : "off"}
    </button>
  );
};
