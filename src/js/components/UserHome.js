import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

import styled, { createGlobalStyle } from "styled-components";
// import Chevron from "../../fonts/chevron.js";

export const UserHome = (props, state) => {
  const [followedClass, setFollowedClass] = useState(null);
  const [loading, setLoading] = useState(false);

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
          var PythonShell = require("python-shell");
          PythonShell.run("python/stepper.py", options, (err, results) => {
            console.log(err);
            console.log(results);
          });
        }}
      >
        Button to call script
      </div>
      <Link to="/about">About</Link>
    </Fragment>
  );
};
