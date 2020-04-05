import React, { useState, useEffect, Fragment } from "react";
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

  return loading ? (
    <div>Loading....</div>
  ) : (
    <Fragment>
      <div>About! This is the about page!!</div>
    </Fragment>
  );
};
