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
  const [animation, setAnimation] = useState();

  const { jukebox } = props;
  const { themes } = props;
  console.log(props);

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

  useEffect(() => {
    //console.log("Lights in View", isActive);
    // setActive(props.location.state.lightsActive);
    //console.log("From Route Light Active", props.location.state);

    // if (props.location.state.lightsActive) {
    //   setActive(true);
    // }

    const themeName = (theme) => {
      console.log("THEME", theme);
      console.log("THEME NAME", theme.name);
      console.log("ANIMATION", animation);
      return theme[animation];
    };

    console.log(themeName());

    if (isActive) {
      socket.emit(
        "lights",
        {
          state: "on",
          animation: animation,
          stripConf: themes.find(themeName),
        },
        (data) => {}
      );
    } else if (isActive != null) {
      socket.emit(
        "lights",
        {
          state: "off",
          animation: animation,
          stripConf: themes.find(themeName),
        },
        (data) => {}
      );
    }
  }, [isActive]);

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

  // const theme_selections = themes.map((selection, index) => {
  //   return (
  //     <ToggleButton
  //       className={isActive ? "lightson" : "lightsoff"}
  //       setActive={setActive}
  //       isActive={isActive}
  //       setAnimationName={"rainbow"}
  //       setAnimation={setAnimation}
  //     />
  //   );
  // });

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

      <ToggleButton
        className={isActive ? "lightson" : "lightsoff"}
        setActive={setActive}
        isActive={isActive}
        setAnimationName={"rainbow"}
        setAnimation={setAnimation}
      />

      <ToggleButton
        className={isActive ? "lightson" : "lightsoff"}
        setActive={setActive}
        isActive={isActive}
        setAnimationName={"twinkle"}
        setAnimation={setAnimation}
      />
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
