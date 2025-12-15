import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle, css } from "styled-components";
import JukeboxGraphic from "./SVG/jukebox";
import { Portal } from "react-is";

const H2 = styled.h2`
  color: ${(props) => props.theme.colors.h2};
  display: block;
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-top: 38px;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
  position: absolute;
  left: 0;
  right: 0;
  top: -25px;
`;

const StyledJukeboxGraphic = styled(JukeboxGraphic)``;

export const Turntable = (props, state) => {
  const { playing } = props;
  const Block = styled.div`
    display: block;
    position: fixed;
    bottom: -168px;
    margin: 0 auto;
    transition: bottom 0.25s ease-in-out;

    ${(props) =>
      playing &&
      css`
        &:hover {
          bottom: -20px;
        }
      `};
  `;
  return (
    <Block>
      <H2>1954 AMi F 120</H2>
      <StyledJukeboxGraphic />
    </Block>
  );
};
