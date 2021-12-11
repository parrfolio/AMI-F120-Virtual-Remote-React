import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
// import Chevron from "../../fonts/chevron.js";
import { PythonShell } from "python-shell";

export const UserHome = (props, state) => {
  const [followedClass, setFollowedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  declare var variableName: any;

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect((e) => {
    console.log("blah");
    // if (communityUserPage) {
    // 	authUserPlaylists.includes(playlistId)
    // 		? setFollowedClass("followed")
    // 		: setFollowedClass(null);
    // } else {
    // 	userPlaylists.includes(playlistId)
    // 		? setFollowedClass("followed")
    // 		: setFollowedClass(null);
    // }
  });

  //   const { data } = props;
  //   const slides = data.map((slide, index) => {
  //     return <div key={index}></div>;
  //   });

  return loading ? (
    <div>Loading....</div>
  ) : (
    <Fragment>
      <div>USER HOME!</div>

      <div
        className={followedClass}
        onClick={(e: Event) => {
          // var gpiop = require("rpi-gpio").promise;
          // gpiop
          //   .setup(7, gpiop.DIR_OUT)
          //   .then(() => {
          //     //    return gpiop.write(7, true)
          //     return console.log(7, true);
          //   })
          //   .catch((err) => {
          //     console.log("Error: ", err.toString());
          //   });

          console.log("hi");

          PythonShell.run("python/stepper.py", null, function(err) {
            if (err) throw err;
            console.log("finished");
          });
        }}
      >
        Button to call script
      </div>
      <Link to="/about">About</Link>
    </Fragment>
  );
};
