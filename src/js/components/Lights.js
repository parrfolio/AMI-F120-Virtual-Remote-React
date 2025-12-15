import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link, RouterLink } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";
import { logout } from "../components/Login/AuthFunctions";
import { Loading } from "./Loading";
import { ToggleButton } from "./ToggleButton";
import { Header } from "./Header";
import { Turntable } from "./Turntable";
import io from "socket.io-client";

const Block = styled.div``;
const FlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: flex-start;
`;

export const Lights = (props, state) => {
  const [loading, setLoading] = useState(true);

  const { jukebox, themes, location } = props;

  console.log(themes);
  console.log("LIGHTS", props);
  // const location = useLocation();

  const animationThemes = Object.entries(themes);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  let animationProp = location.state
    ? location.state.lights.animation
    : "undefined";

  let animationPropActive = animationProp ? animationProp : "";
  const [animation, setAnimation] = useState(animationPropActive);

  let runningProp = location.state ? location.state.lights.running : false;
  const [isRunning, setRunning] = useState(runningProp);

  let isActiveProp = location.state ? location.state.lights.active : null;
  const [isActiveIndex, setActiveIndex] = useState(isActiveProp);

  const [appState, changeState] = useState({
    activeObject: null,
    animations: animationThemes.map((selection, index) => {
      return { id: index, name: selection[0] };
    }),
  });

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevAnimation = usePrevious(animation);
  const toggleActive = (index) => {
    changeState({
      ...appState,
      activeObject: appState.animations[index].id,
    });
    setActiveIndex(index);
    setAnimation(appState.animations[index].name);
  };

  // console.log("Light State", animation, isRunning);
  // console.log("Light Props", animationPropActive, runningProp);

  useEffect(() => {
    if (appState.activeObject != null) {
      if (appState.animations[isActiveIndex].id === appState.activeObject) {
        if (isRunning) {
          socket.emit(
            "lights",
            {
              state: "on",
              animation: animation,
              stripConf: themes[animation],
            },
            (response) => {
              setRunning(response.running);
            }
          );
        } else {
          if (prevAnimation != animation) {
            socket.emit(
              "lights",
              {
                state: "off",
                animation: prevAnimation,
                stripConf: themes[animation],
              },
              (response) => {
                setRunning(response.running);
                socket.removeAllListeners("lights");
                socket.emit(
                  "lights",
                  {
                    state: "on",
                    animation: animation,
                    stripConf: themes[animation],
                  },
                  (response) => {
                    setRunning(response.running);
                  }
                );
              }
            );
          } else {
            socket.emit(
              "lights",
              {
                state: "off",
                animation: animation,
                stripConf: themes[animation],
              },
              (response) => {
                setRunning(response.running);
                socket.removeAllListeners("lights");
              }
            );
          }
        }
      }
    }
  }, [appState]);

  // establish socket connection
  useEffect(() => {
    setLoading(false);
    setSocket(io());
  }, []);

  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setSocketConnected(socket.connected);
    });
    socket.on("disconnect", () => {
      setSocketConnected(socket.connected);
    });
  }, [socket]);

  const theme_selections = animationThemes.map((selection, index) => {
    return (
      <ToggleButton
        key={index}
        index={index}
        toggleActive={toggleActive}
        setRunning={setRunning}
        isRunning={isRunning}
        isActiveIndex={isActiveIndex}
        setAnimationName={selection[0]}
        className={
          isRunning ? "lightson" + selection[0] : "lightsoff" + selection[0]
        }
        setAnimation={setAnimation}
      />
    );
  });
  return loading ? (
    <Loading />
  ) : (
    <Block>
      <Header
        {...{ animation, running: isRunning, active: isActiveIndex, nav: true }}
      />
      <FlexBox>{theme_selections}</FlexBox>
      <FlexBox>
        <Turntable {...{ playing: true }} />
      </FlexBox>
    </Block>
  );
};
