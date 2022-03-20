import React, { useState, useCallback } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation, key, AnimationName } = props;

  const handleActive = (key) => {
    console.log("AnimationName", AnimationName);
    console.log("KEY", key);
    let name = [...isActive];
    console.log("NAME", name);
    name[key] = key;

    console.log("NAME MATCH", (name[key] = key));

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
