import React from "react";
import styled from "styled-components";

const SVG = ({
  fill = "#ffffff",
  width = "100%",
  height = "24",
  className = "",
  viewBox = "0 0 277 24",
}) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none">
    <path
      d="M45.5 11L57 1H220L231.5 12.5L220 22.5L57 21.5L45.5 11Z"
      fill="white"
    />
    <path
      d="M45.5 11L57 1H220L231.5 12.5M45.5 11H0M45.5 11L57 21.5L220 22.5L231.5 12.5M231.5 12.5H276.5"
      stroke="#CA3A49"
      strokeWidth="2"
    />
  </svg>
);

export default SVG;
