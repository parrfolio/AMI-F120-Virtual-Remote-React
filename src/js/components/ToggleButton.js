import React, { useState, useCallback } from "react";
export const ToggleButton = (props) => {
  const {
    isActive,
    setActive,
    setAnimation,
    animationIndex,
    AnimationName,
  } = props;

  const handleActive = (animationIndex) => {
    console.log("AnimationName", AnimationName);
    console.log("KEY", animationIndex);
    let name = [...isActive];
    console.log("NAME", name);
    name[animationIndex] = animationIndex;

    console.log("NAME MATCH", (name[animationIndex] = animationIndex));

    setActive(name);
  };
  return (
    <button
      key={key}
      onClick={() => {
        setAnimation(AnimationName);
        handleActive(animationIndex);
      }}
    >
      {AnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
