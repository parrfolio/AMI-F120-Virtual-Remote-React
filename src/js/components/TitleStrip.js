import React, { useState, useEffect, Fragment } from "react";
import styled, { ThemeContext } from "styled-components";
import { Loading } from "./Loading";
import io from "socket.io-client";

const Block = styled.div`
  width: 100%;
  height: 74px;
  color: black;
  border-radius: 13px;
  overflow: hidden;
  border: 3px solid #ca3a49;
  position: relative;
  padding: 0;
  background-color: ${(props) => props.theme.colors.titleStripBg};
  background-image: url('data:image/svg+xml,<svg width="277" height="24" viewBox="0 0 277 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45.5 11L57 1H220L231.5 12.5L220 22.5L57 21.5L45.5 11Z" fill="white"/><path d="M45.5 11L57 1H220L231.5 12.5M45.5 11H0M45.5 11L57 21.5L220 22.5L231.5 12.5M231.5 12.5H276.5" stroke="%23CA3A49" stroke-width="2"/></svg>');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 135%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  ${({ theme }) => theme.babybear`background-size: contain;`}
`;

const SelectionNumber = styled.h2`
  color: ${(props) => props.theme.colors.titleStripNumber};
  display: block;
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: ${(props) => props.theme.fontSizes.sm};
  text-align: center;
  line-height: 1.2;
  order: 0;
  flex: 0 1 auto;
  align-self: stretch;
  margin: 0 0 5px 0;
`;

const SelectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.titleStripTitle};
  display: block;
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: ${(props) => props.theme.fontSizes.sm};
  text-align: center;
  line-height: 1.2;
  order: 0;
  flex: 0 1 auto;
  align-self: stretch;
  margin: 0 0 5px 0;
`;

const SelectionArtist = styled.h2`
  color: ${(props) => props.theme.colors.titleStripTitle};
  display: block;
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: ${(props) => props.theme.fontSizes.sm};
  text-align: center;
  line-height: 1.2;
  order: 0;
  flex: 0 1 auto;
  align-self: stretch;
`;

export const TitleStrip = (props, state) => {
  const { selection } = props;
  console.log(selection);

  let runningProp = location.state ? location.state.lights.running : false;
  const [isRunning, setRunning] = useState(runningProp);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  // establish socket connection
  useEffect(() => {
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

  return (
    <Block
      onClick={(e: Event) => {
        console.log("onclick fired!");
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
      <SelectionNumber> {selection[0]} </SelectionNumber>
      <SelectionArtist>{selection[2]}</SelectionArtist>
      <SelectionTitle>{selection[1]}</SelectionTitle>
    </Block>
  );
};
