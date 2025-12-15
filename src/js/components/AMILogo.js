import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";

import AmiLogo from "./Assets/AmiLogo.png";

const Logo = styled.img`
  max-height: 67px;
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  margin-bottom: -20px;
`;
export const AMILogo = (props, state) => {
  return <Logo src={AmiLogo} />;
};
