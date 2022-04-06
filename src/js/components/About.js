import React, { useState, useEffect, Fragment, useLocation } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

export const About = (props, state) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  //   const { data } = props;
  //   const slides = data.map((slide, index) => {
  //     return <div key={index}></div>;
  //   });

  console.log(props);
  const location = useLocation();
  const { lights } = location.state;

  return loading ? (
    <div>Loading....</div>
  ) : (
    <Fragment>
      <div>About Page</div>
      <Link
        to={{
          pathname: "/home",
          state: props.location.state,
        }}
      >
        Home
      </Link>
    </Fragment>
  );
};
