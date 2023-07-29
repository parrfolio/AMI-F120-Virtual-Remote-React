import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeContext, keyframes } from "styled-components";

import AmiMusicLogo from "./Assets/AmiMusicLogo.png";

const spin = keyframes`
from {
  transform:rotate(0deg);
}
to {
  transform:rotate(360deg);
}
 `;

const Block = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.colors.header};
`;
const Throbber = styled.img`
  max-height: 25%;
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  animation-name: ${spin};
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;
export const Loading = (props, state) => {
  return (
    <Block>
      <Throbber src={AmiMusicLogo} />
    </Block>
  );
};
