import React, { useState, useCallback } from "react";
export const ToggleButton = (state, props) => {
  const {
    isActive,
    setActive,
    setAnimation,
    key,
    setAnimationName,
    toggledButtonId,
    setToggledButtonId,
  } = props;

  const toggleButton = (keyId) => (e) => {
    e.preventDefault();
    setToggledButtonId((state) => ({
      ...state,
      [keyId]: !state[keyId],
    }));
  };

  const isToggled = key === toggledButtonId;

  return (
    <button
      key={key}
      onClick={() => {
        setAnimation(setAnimationName);
        setActive(!isActive);
        toggleButton(key);
      }}
    >
      ButtonID: {key} {setAnimationName} {isActive ? "On" : "Off"}
    </button>
  );
};
