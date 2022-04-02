import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import io from "socket.io-client";
import { ToggleButton } from "./ToggleButton";

// import Chevron from "../../fonts/chevron.js";

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
  const [isActive, setActive] = useState(null);

  const [isRunning, setRunning] = useState(false);

  const [appState, changeState] = useState({
    activeObject: null,
    previousObject: null,
    objects: [
      { id: 0, on: false },
      { id: 1, on: false },
      { id: 2, on: false },
    ],
  });

  const toggleActive = (index, running) => {
    changeState({
      ...appState,
      activeObject: appState.objects[index],
      previousObject:
        appState.previousObject != null
          ? appState.activeObject
          : { id: index, on: running },
    });
  };

  const toggleActiveButton = (index) => {
    console.log("State", appState.objects[index], appState.activeObject);
    console.log("State", appState.objects[index] === appState.activeObject);

    if (appState.objects[index] === appState.activeObject) {
      console.log("Running", isRunning, animation);
      socket.emit(
        "lights",
        {
          state: "on",
          animation: animation,
          stripConf: themes[animation],
        },
        (data) => {}
      );
    } else {
      console.log("Running", isRunning, animation);
      socket.emit(
        "lights",
        {
          state: "off",
          animation: animation,
          stripConf: themes[animation],
        },
        (data) => {}
      );
    }
  };

  const toggleActiveStyle = (index) => {
    if (appState.objects[index] === appState.activeObject) {
      return "active";
    } else {
      return "inactive";
    }
  };

  // useEffect(() => {
  //   console.log(appState.activeObject, appState.previousObject);

  //   if (appState.previousObject != null) {
  //     // let pState = appState.previousObject.id;
  //     // let aState = appState.activeObject.id;
  //     // let p = Object.entries(pState)
  //     //   .sort()
  //     //   .toString();
  //     // let a = Object.entries(aState)
  //     //   .sort()
  //     //   .toString();
  //     console.log(appState.previousObject.id === appState.activeObject.id);

  //     if (appState.previousObject.id === appState.activeObject.id) {
  //       if (!isRunning) return;
  //       console.log("Socket ON", animation)
  //       // socket.emit(
  //       //   "lights",
  //       //   {
  //       //     state: "on",
  //       //     animation: animation,
  //       //     stripConf: themes[animation],
  //       //   },
  //       //   (data) => {}
  //       // );
  //     } else {
  //       // socket.emit(
  //       //   "lights",
  //       //   {
  //       //     state: "off",
  //       //     animation: animation,
  //       //     stripConf: themes[animation],
  //       //   },
  //       //   (data) => {}
  //       // );
  //     }
  //   }
  // }, [appState.activeObject]);

  const [animation, setAnimation] = useState();

  const { jukebox } = props;
  const { themes } = props;
  // console.log(props);

  const toggleClass = () => {
    setActive(!isActive);
  };

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
        className={isActive ? "lightson" : "lightsoff"}
        key={selection.id}
        onClick={(e: Event) => {
          console.log("selection choose");

          //turn off lights before pulse trains starts (performance)
          if (isActive) setActive(false);

          socket.emit("direction", selection.select, (response) => {
            //when pulse train is done, turn back on lights
            console.log(response);
            if (response.done) {
              setActive(response.done);
            }
          });
        }}
      >
        Selection {selection.id} - {selection.songTitle}
      </div>
    );
  });

  const theme_selections = Object.entries(themes).map((selection, index) => {
    // console.log(index);
    // console.log(selection);
    return (
      <ToggleButton
        key={index}
        index={index}
        toggleActive={toggleActive}
        toggleActiveButton={toggleActiveButton}
        toggleActiveStyle={toggleActiveStyle}
        setRunning={setRunning}
        isRunning={isRunning}
        className={
          isActive ? "lightson" + selection[0] : "lightsoff" + selection[0]
        }
        setAnimationName={selection[0]}
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
            lightsActive: isActive,
          },
        }}
      >
        About
      </Link>
    </Fragment>
  );
};
