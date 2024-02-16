import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";

import ToneArmImage from "./Assets/tonearm.png";

const ToneArm = styled.img`
  max-height: 67px;
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  margin-bottom: -20px;
`;
export const Tonearm = (props, state) => {
  return <ToneArm src={ToneArmImage} />;
};
