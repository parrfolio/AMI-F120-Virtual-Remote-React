import React, { useState } from "react";
export const ToggleButton = (props) => {
  const { isActive, setActive, setAnimation } = props;
  return (
    <button
      className={isActive}
      onClick={() => {
        setAnimation("rainbow");
        setActive(!isActive);
      }}
    >
      Rainbow {isActive}
    </button>
  );
};
