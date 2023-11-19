import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link, RouterLink, useLocation } from "react-router-dom";
//import styled, { createGlobalStyle } from "styled-components";
import styled, { ThemeContext } from "styled-components";
import { logout } from "../components/Login/AuthFunctions";

import io from "socket.io-client";

import { isYandex } from "react-device-detect";
import { call } from "file-loader";
import { Loading } from "./Loading";
import { Turntable } from "./Turntable";
import { Header } from "./Header";
import { TitleStrips } from "./TitleStrips";

const Block = styled.div``;
const FlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: flex-start;
`;

export const UserHome = (props, state) => {
  const [loading, setLoading] = useState(true);
  const { jukebox } = props;
  const location = useLocation() && { state: "home" };
  const { lights } = location.state;
  useEffect(() => {
    setLoading(false);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Block>
      <Header
        // {...{ animation, running: isRunning, active: isActiveIndex, nav: true }}
        {...{ nav: true }}
      />
      <FlexBox>
        <TitleStrips {...{ jukebox }} />
        {/* <div>
          Light Running {lights.running}
          Light Animation {lights.animation}
        </div> */}
      </FlexBox>
      <FlexBox>
        <Turntable {...{ playing: true }} />
      </FlexBox>
    </Block>
  );
};
