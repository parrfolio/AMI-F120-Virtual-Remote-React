import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";
import { AMILogo } from "./AMILogo";
const Block = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: flex-end;
  height: 70px;
  background-color: ${(props) => props.theme.colors.header};
`;
export const Header = (props, state) => {
  return (
    <Block>
      <AMILogo />
    </Block>
  );
};
