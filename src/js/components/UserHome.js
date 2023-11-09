import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link, RouterLink } from "react-router-dom";
//import styled, { createGlobalStyle } from "styled-components";
import styled, { ThemeContext } from "styled-components";
import { logout } from "../components/Login/AuthFunctions";

import io from "socket.io-client";
import { ToggleButton } from "./ToggleButton";
import { isYandex } from "react-device-detect";
import { call } from "file-loader";
import { Loading } from "./Loading";
import { Turntable } from "./Turntable";
import { Header } from "./Header";

const Block = styled.div``;
const FlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: flex-start;
`;

const StyledFlex = styled.div`
  align-items: top;
  justify-content: top;
  color: ${(props) => props.theme.nav};
  text-decoration: none;
  text-transform: uppercase;
  display: block;
  font-family: ${(props) => props.theme.fonts.nav};
  font-size: ${(props) => props.theme.fontSizes.md};
  ${({ theme }) => theme.mamabear`display:inline-block`}
`;

export const UserHome = (props, state) => {
  const { jukebox, themes, location } = props;
  const animationThemes = Object.entries(themes);

  console.log(animationThemes);

  const [loading, setLoading] = useState(false);

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

  const jukebox_data = jukebox.map((selection, index) => {
    return (
      <div
        key={selection.id}
        onClick={(e: Event) => {
          //turn off lights before pulse trains starts (performance gain for pi)
          if (isRunning) {
            socket.emit(
              "lights",
              {
                state: "off",
                animation: animation,
                stripConf: themes[animation],
              },
              (response) => {
                setRunning(response.running);
                socket.emit("direction", selection, (callback) => {
                  //when pulse train is done, turn back on lights
                  if (callback.done) {
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
                });
              }
            );
          } else {
            socket.emit("direction", selection, (callback) => {
              console.log(callback);
            });
          }
        }}
      >
        Selection {selection.id} - {selection.songTitle}
      </div>
    );
  });

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
      <FlexBox>
        {jukebox_data}
        <div
          onClick={(e: Event) => {
            console.log("turn off selections");
            socket.emit(
              "direction",
              {
                state: "off",
                selection: 0,
                ptrains: [0, 0],
              },
              (data) => {
                //console.log(data);
              }
            );
          }}
        >
          Stop
        </div>
        <Block>{theme_selections}</Block>
      </FlexBox>
      <FlexBox>
        <Turntable />
      </FlexBox>
    </Block>
  );
};
