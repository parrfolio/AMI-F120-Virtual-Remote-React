import React, { useState, useEffect, Fragment } from "react";
import { Link, RouterLink } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";
import { AMILogo } from "./AMILogo";
import { logout } from "../components/Login/AuthFunctions";
const Block = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: flex-end;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: ${(props) => props.theme.colors.header};
`;
export const Header = (props, state) => {
  const { animation, running, active, nav } = props;

  console.log("Props ---->", props);
  return (
    <Block>
      <AMILogo />
      {nav && (
        <Fragment>
          <Link
            to={{
              pathname: "/songs",
              state: {
                lights: {
                  animation: animation,
                  running: running,
                  active: active,
                },
              },
            }}
          >
            Songs
          </Link>
          <Link as={RouterLink} to="/" onClick={logout}>
            Logout
          </Link>
          <Link
            to={{
              pathname: "/lights",
              state: {
                lights: {
                  animation: animation,
                  running: running,
                  active: active,
                },
              },
            }}
          >
            Lights
          </Link>
        </Fragment>
      )}
    </Block>
  );
};
