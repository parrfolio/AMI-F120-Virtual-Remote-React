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
          //   .setup(32, gpiop.DIR_OUT)
          //   .then(() => {
          //     //    return gpiop.write(7, true)
          //     return console.log(32, true);
          //   })
          //   .catch((err) => {
          //     console.log("Error: ", err.toString());
          //   });
          var gpio = require("rpi-gpio");

          var pin = 32;
          var delay = 2000;
          var count = 0;
          var max = 3;

          gpio.setup(pin, gpio.DIR_OUT, on);

          function on() {
            if (count >= max) {
              gpio.destroy(function() {
                console.log("Closed writePins, now exit");
              });
              return;
            }

            setTimeout(function() {
              console.log("Off");
              gpio.write(pin, 1, off);
              count += 1;
            }, delay);
          }

          function off() {
            setTimeout(function() {
              console.log("On");
              gpio.write(pin, 0, on);
            }, delay);
          }

          console.log("hi");
        }}
      >
        Button to call script
      </div>
      <Link to="/about">About</Link>
    </Fragment>
  );
};
