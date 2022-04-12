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

  // console.log("Active Index", isActiveIndex);

  return (
    <button
      key={index}
      className={isRunning && running ? "on" : "off"}
      onClick={() => {
        toggleActive(index);
        setRunning(!isRunning);
      }}
    >
      {/* {console.log(
        "is Running",
        isRunning,
        "is ActiveIndex",
        isActiveIndex,
        "is Index",
        index
      )} */}
      {setAnimationName} Lights {isRunning && running ? "on" : "off"}
    </button>
  );
};
