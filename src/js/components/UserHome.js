import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import io from "socket.io-client";

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
    setActive(!isActive);
    // if (isActive) {
    //   socket.emit(
    //     "lights",
    //     {
    //       state: "on",
    //     },
    //     (data) => {
    //       console.log(data);
    //     }
    //   );
    // } else if (isActive != null) {
    //   socket.emit(
    //     "lights",
    //     {
    //       state: "off",
    //     },
    //     (data) => {
    //       console.log(data);
    //     }
    //   );
    // }
  }, [isActive]);

  // // manage socket connection
  // const handleSocketConnection = () => {
  //   if (socketConnected) socket.disconnect();
  //   else {
  //     socket.connect();
  //   }
  // };

  const { jukebox } = props;
  console.log(props);
  const jukebox_data = jukebox.map((selection, index) => {
    return (
      <div
        key={selection.id}
        onClick={(e: Event) => {
          console.log("turned it on");
          socket.emit("direction", selection.select, (data) => {
            //console.log(data);
          });
        }}
      >
        Selection {selection.id} - {selection.songTitle}
      </div>
    );
  });

  return loading ? (
    <div>Loading....</div>
  ) : (
    <Fragment>
      <Block>{jukebox_data}</Block>
      <div
        onClick={(e: Event) => {
          console.log("turned it off");
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
      {/* <div
        className={isActive ? "lightson" : "lightsoff"}
        onClick={toggleClass}
      >
        Rainbow Lights {isActive ? "On" : "Off"}
      </div> */}

      <div
        className={isActive ? "lightson" : "lightsoff"}
        onClick={(e: Event) => {
          {
            (() => {
              if (isActive) {
                socket.emit(
                  "lights",
                  {
                    state: "on",
                  },
                  (data) => {
                    console.log(data);
                  }
                );
              } else if (isActive != null) {
                socket.emit(
                  "lights",
                  {
                    state: "off",
                  },
                  (data) => {
                    console.log(data);
                  }
                );
              } else {
                socket.emit(
                  "lights",
                  {
                    state: "off",
                  },
                  (data) => {
                    console.log(data);
                  }
                );
              }
            })();
          }
        }}
      >
        Lights {isActive ? "On" : "Off"}
      </div>
      <Link to="/about">About</Link>
    </Fragment>
  );
};
