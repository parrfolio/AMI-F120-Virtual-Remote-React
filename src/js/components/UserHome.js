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

  var ClientStream = require("openpixelcontrol-stream").OpcClientStream,
    net = require("net");

  var NUM_LEDS = 100,
    OPC_CHANNEL = 0;

  var client = new ClientStream();

  // connect to openpixelcontrol-server at `192.168.1.42:7890`
  var socketPipe = net.createConnection(7890, "192.168.135.204", function() {
    client.pipe(socketPipe);

    run();
  });

  function run() {
    // create a typed-array for color-data
    var data = new Uint32Array(NUM_LEDS);

    // setup an animation-loop at 10FPS
    setInterval(function() {
      // ... update colors in `data` ...

      client.setPixelColors(OPC_CHANNEL, data);
    }, 100);
  }

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
        className={followedClass}
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
      <div
        className={followedClass}
        onClick={(e: Event) => {
          console.log("lights!!");
          socket.emit(
            "lights",
            {
              state: "on",
            },
            (data) => {
              //console.log(data);
            }
          );
        }}
      >
        Lights
      </div>
      <Link to="/about">About</Link>
    </Fragment>
  );
};
