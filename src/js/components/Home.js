import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Header } from "./Header";
import { Loading } from "./Loading";
import { LoginForm } from "./Login/Login";
import { Turntable } from "./Turntable";

const Block = styled.div``;
const FlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: flex-start;
`;

export const Home = (props, state) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  //   const { data } = props;
  //   const slides = data.map((slide, index) => {
  //     return <div key={index}></div>;
  //   });

  return loading ? (
    <Loading />
  ) : (
    <Block>
      <Header {...{ nav: false }} />
      <FlexBox>
        <LoginForm />
      </FlexBox>
      <FlexBox>
        <Turntable />
      </FlexBox>
    </Block>
  );
};
