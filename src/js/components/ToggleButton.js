import React, { useState } from "react";
export const ToggleButton = (props) => {
  const { className } = props;
  return <button className={className}>Rainbow {className}</button>;
};
