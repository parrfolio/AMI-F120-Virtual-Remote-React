import React, { useState, useEffect, Fragment } from "react";
import { Link, RouterLink } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";
import { AMILogo } from "./AMILogo";
import { logout } from "./Login/AuthFunctions";

import { TitleStrip } from "./TitleStrip";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-gap: 1em;
  width: 100%;
  padding-top: 100px;
  padding-bottom: 100px;
  margin: 0 2.5%;
`;
export const TitleStrips = (props, state) => {
  const { jukebox } = props;
  const jukeboxSelections = jukebox.map((selections, index) => {
    console.log(selections);
    let songTitlefoo = [];
    selections.disc.forEach(function(selection, index) {
      console.log(selection.songTitle);

      songTitlefoo.push(selection.songTitle);
    });
    songTitlefoo.push(selections.disc[0].artist);
    console.log("foo arry " + songTitlefoo);
    return <TitleStrip key={index} selection={songTitlefoo} />;
  });
  const { jukebox_data } = props;

  return (
    <Grid>
      {jukeboxSelections}
      {/* <div
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
      </div> */}
    </Grid>
  );
};
