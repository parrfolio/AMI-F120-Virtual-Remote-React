import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Loading } from "./Loading";

export const About = (props, state) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  //   const { data } = props;
  //   const slides = data.map((slide, index) => {
  //     return <div key={index}></div>;
  //   });

  console.log("ABOUT", props);
  const location = useLocation();
  const { lights } = location.state;

  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      <div>About Page Is awesome!</div>
      <div>
        Light Running {lights.running}
        Light Animation {lights.animation}
      </div>
      <Link
        to={{
          pathname: "/",
          state: props.location.state,
        }}
      >
        Home
      </Link>
    </Fragment>
  );
};
