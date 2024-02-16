import React from "react";
import styled from "styled-components";

const SVG = ({
  fill = "#ffffff",
  width = "21.395px",
  height = "100%",
  className = "",
  viewBox = "0 0 21 21",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={viewBox}
    className={`svg-facebook ${className || ""}`}
    fill="none"
  >
    <g>
      <path
        d="M21.3207 11.1314C21.3207 5.46955 16.7309 0.879732 11.069 0.879732C5.4072 0.879732 0.817383 5.46955 0.817383 11.1314C0.817383 16.2483 4.56626 20.4894 9.46721 21.2585V14.0947H6.86425V11.1314H9.46721V8.87281C9.46721 6.30349 10.9977 4.88428 13.3394 4.88428C14.461 4.88428 15.6342 5.08451 15.6342 5.08451V7.60737H14.3415C13.068 7.60737 12.6708 8.39761 12.6708 9.20833V11.1314H15.5141L15.0596 14.0947H12.6708V21.2585C17.5718 20.4894 21.3207 16.2483 21.3207 11.1314Z"
        fill={fill}
      />
    </g>
  </svg>
);

export default SVG;
