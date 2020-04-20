import React, { useState, useEffect, Fragment } from "react";

import styled, { createGlobalStyle } from "styled-components";
// import Chevron from "../../fonts/chevron.js";

export const UserHome = (props, state) => {
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
      <div>USER HOME!</div>
    </Fragment>
  );
};
