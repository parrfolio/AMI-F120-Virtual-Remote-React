import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import io from "socket.io-client";
import { ToggleButton } from "./ToggleButton";
import { isYandex } from "react-device-detect";

const Block = styled.div`
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  position: relative;
  width: 100%;
  ${({ theme }) => theme.mamabear`margin-left:-5%`}
`;

export const UserHome = (props, state) => {
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [animation, setAnimation] = useState();
  const [isRunning, setRunning] = useState(false);
  const [isActiveIndex, setActiveIndex] = useState(null);
  const { jukebox } = props;
  const { themes } = props;
  const [appState, changeState] = useState({
    activeObject: null,
    animations: [
      { id: 0, name: "rainbow" },
      { id: 1, name: "twinkle" },
    ],
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
              setRunning(true);
            }
          );
        } else {
          console.log("Running False from OFF Statement");
          if (prevAnimation != animation) {
            socket.emit(
              "lights",
              {
                state: "off",
                animation: prevAnimation,
                stripConf: themes[animation],
              },
              (response) => {
                setRunning(false);
                socket.emit(
                  "lights",
                  {
                    state: "on",
                    animation: animation,
                    stripConf: themes[animation],
                  },
                  (response) => {
                    setRunning(true);
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
                setRunning(false);
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

  // // manage socket connection
  // const handleSocketConnection = () => {
  //   if (socketConnected) socket.disconnect();
  //   else {
  //     socket.connect();
  //   }
  // };

  const jukebox_data = jukebox.map((selection, index) => {
    return (
      <div
        className={isRunning ? "lightson" : "lightsoff"}
        key={selection.id}
        onClick={(e: Event) => {
          console.log("IS Running on choose selection", isRunning);

          //turn off lights before pulse trains starts (performance)
          console.log;
          if (isRunning) {
            socket.emit(
              "lights",
              {
                state: "off",
                animation: animation,
                stripConf: themes[animation],
              },
              (response) => {
                setRunning(false);
                socket.emit("direction", selection.select, (response) => {
                  //when pulse train is done, turn back on lights
                  console.log(response);
                  if (response.done) {
                    setRunning(response.done);
                    socket.emit(
                      "lights",
                      {
                        state: "on",
                        animation: animation,
                        stripConf: themes[animation],
                      },
                      (response) => {
                        setRunning(true);
                      }
                    );
                  }
                });
              }
            );
          }
        }}
      >
        Selection {selection.id} - {selection.songTitle}
      </div>
    );
  });

  const theme_selections = Object.entries(themes).map((selection, index) => {
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
    <div>Loading....</div>
  ) : (
    <Fragment>
      <Block>{jukebox_data}</Block>
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
      <Link
        to={{
          pathname: "/about",
          state: {
            lightsActive: isRunning,
          },
        }}
      >
        About
      </Link>
    </Fragment>
  );
};
