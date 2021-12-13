import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import io from "socket.io-client";

// import Chevron from "../../fonts/chevron.js";
export const UserHome = (props, state) => {
  const [followedClass, setFollowedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    setLoading(false);
    setSocket(io());
  }, []);

  // establish socket connection

  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setSocketConnected(socket.connected);
    });
    socket.on("disconnect", () => {
      setSocketConnected(socket.connected);
    });

    // socket.on("getDate", (data) => {
    //   setDt(data);
    // });
  }, [socket]);

  useEffect((e) => {
    console.log(socket);
    // if (socket) {

    // } else {

    // }
  }, []);

  // // manage socket connection
  // const handleSocketConnection = () => {
  //   if (socketConnected) socket.disconnect();
  //   else {
  //     socket.connect();
  //   }
  // };

  // // subscribe to socket date event
  // const subscribeToDateEvent = (interval = 1000) => {
  //   socket.emit("subscribeToDateEvent", interval);
  // };

  //   const { data } = props;
  //   const slides = data.map((slide, index) => {
  //     return <div key={index}></div>;
  //   });

  const { jukebox } = props;
  console.log(props);
  const jukebox_data = jukebox.map((selection, index) => {
    return (
      <div
        key={selection.id}
        className={followedClass}
        onClick={(e: Event) => {
          console.log("turned it on");
          socket.emit("direction", selection.select, (data) => {
            //console.log(data);
          });
        }}
      >
        {/* <Slide
          {...slide}
          beforeChange={beforeChange}
          afterChange={afterChange}
          onResize={onResize}
        /> */}
        Selection {selection.id}
      </div>
    );
  });

  return loading ? (
    <div>Loading....</div>
  ) : (
    <Fragment>
      <div>USER HOME!</div>
      {jukebox_data}
      <div
        className={followedClass}
        onClick={(e: Event) => {
          console.log("turned it off");
          socket.emit(
            "direction",
            {
              state: "off",
              selection: 0,
              ptrains: [2, 10],
            },
            (data) => {
              //console.log(data);
            }
          );
        }}
      >
        Stop
      </div>
      <Link to="/about">About</Link>
    </Fragment>
  );
};
