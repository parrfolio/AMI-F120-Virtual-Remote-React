import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle, css } from "styled-components";

import {
  login,
  resetPassword,
  twitterAuth,
  googleAuth,
  appleAuth,
  fbAuth,
} from "./AuthFunctions";

import FacebookIcon from "../SVG/facebook";
import GoogleIcon from "../SVG/google";
import AppleIcon from "../SVG/apple";
import HrOrIcon from "../SVG/hror";

const FlexBlockInner = styled.div`
  order: 0;
  flex: 0 1 auto;
  align-self: stretch;
`;
const FormFlexBlock = styled(FlexBlockInner)`
  margin: 0 auto;
`;

const H1 = styled.h1`
  color: ${(props) => props.theme.colors.h1};
  display: block;
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-top: 38px;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
`;

//hr
const StyledHrOrContainer = styled.div`
  height: 20px;
  margin-top: 20px;
  width: 100%;
`;

const before = css`
  &::before {
    content: "";
    height: 1px;
    background-color: #000;
    display: block;
    margin-top: 6.5%;
    margin-right: 5%;
  }
`;

const StyledOr = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas: ". . .";
  line-height: 0.9;
  text-align: center;
  width: 100%;
  font-size: ${(props) => props.theme.fontSizes.md};
  font-family: ${(props) => props.theme.fonts.reg};
  ${(props) => props.hasBefore && before}
  ${(props) => props.hasAfter && after}
`;

const after = css`
  &::after {
    content: "";
    height: 1px;
    background-color: #000;
    margin-top: 6.5%;
    margin-left: 5%;
  }
`;

//social buttons
const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  height: 100%;
  height: 170px;
  margin-top: 10px;
`;

const Button = styled.button`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 13.372px;
  align-items: flex-start;
  gap: 13.372px;
  flex-shrink: 0;
  border-radius: 9px;
  color: #fff;
  font-family: ${(props) => props.theme.fonts.reg};
  font-size: ${(props) => props.theme.fontSizes.sm};
  border: 0 none;
`;

const StyledHrOr = styled(HrOrIcon)``;

const StyledFacebookIcon = styled(FacebookIcon)``;

const FacebookButton = styled(Button)`
  background: #1877f2;
`;

const StyledAppleIcon = styled(AppleIcon)``;

const AppleButton = styled(Button)`
  background: #000;
`;

const StyledGoogleIcon = styled(GoogleIcon)``;

const GoogleButton = styled(Button)`
  background: #fff;
  color: rgba(0, 0, 0, 0.54);
  border-radius: 8.914px;
  background: #fff;
  box-shadow: 0px 1.7828948497772217px 2.674342155456543px 0px
      rgba(0, 0, 0, 0.17),
    0px 0px 2.674342155456543px 0px rgba(0, 0, 0, 0.08);
`;

//Login Form
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  width: 100%;
`;

const StyledLabel = styled.label`
  display: block;
  font-weight: bold;
  color: ${(props) =>
    props.invalid ? props.theme.colors.invalid : props.theme.colors.h1};
  display: block;
  padding: 0.5rem 0;
  font-family: ${(props) => props.theme.fonts.reg};
  font-size: ${(props) => props.theme.fontSizes.sm};
  align-self: stretch;
  width: 100%;
`;

const StyledInput = styled.input`
  color: ${(props) => props.theme.colors.h1};
  padding: 0.5rem;
  font-family: ${(props) => props.theme.fonts.reg};
  font-size: ${(props) => props.theme.fontSizes.sm};
  border-radius: 4px;
  border: ${(props) =>
    props.invalid
      ? "1px solid" + props.theme.colors.invalid
      : "1px solid" + props.theme.colors.lightgray};

  background: var(--i-osbg, rgba(249, 249, 249, 0.8));
  border-radius: 3px;
  display: flex;
  height: 46px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  width: 100%;
`;

const LoginButton = styled(Button)`
  font-weight: bold;
  background-color: #bc2a31;
  text-align: center;
  cursor: pointer;
  display: block;
  text-align: center;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1;
  }
  margin-top: 20px;
  opacity: ${(props) => (!props.enabled ? 0.5 : 1)};
`;

const StyledAlert = styled.div`
  color: ${(props) => props.theme.colors.invalid};
  padding: 0.5rem;
  font-family: ${(props) => props.theme.fonts.reg};
  font-size: ${(props) => props.theme.fontSizes.sm};
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  width: 100%;
  max-width: 250px;
`;

export const LoginForm = (props, state) => {
  const [email, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [emailInvalid, setemaildInvalid] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [ErrorMsg, setErrorMsg] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).catch((error) => {
      setErrorMsg(error.message);

      if (
        error.code == "auth/wrong-password" ||
        error.code == "auth/invalid-email" ||
        error.code == "auth/user-not-found"
      ) {
        setPasswordInvalid(true);
      } else {
        setPasswordInvalid(false);
      }
    });
  };

  const usernameEntered = (e) => {
    setUseremail(e.target.value);
    // buttonEnabled(username, password)
  };

  const passwordEntered = (e) => {
    setPassword(e.target.value);
    // buttonEnabled(username, password)
  };

  const buttonEnabled = (username, pw) => {
    if (username.length > 0 && password.length > 0) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  };
  return (
    <FlexBlockInner>
      <H1>Jukebox Remote Login</H1>
      <FormFlexBlock>
        <StyledForm onSubmit={handleSubmit}>
          <StyledLabel invalid={emailInvalid}>Email:</StyledLabel>
          <StyledInput
            invalid={emailInvalid}
            type="text"
            value={email}
            onChange={(e) => usernameEntered(e)}
          />
          <StyledLabel invalid={passwordInvalid}>Password:</StyledLabel>
          <StyledInput
            invalid={passwordInvalid}
            type="password"
            value={password}
            onChange={(e) => passwordEntered(e)}
          />
          {ErrorMsg && <StyledAlert>{ErrorMsg}</StyledAlert>}
          <LoginButton type="submit" disabled={!email || !password}>
            Login
          </LoginButton>
        </StyledForm>
        <StyledHrOrContainer>
          <StyledOr hasBefore hasAfter>
            Or log in with
          </StyledOr>
        </StyledHrOrContainer>
        <SocialButtons>
          <AppleButton onClick={appleAuth}>
            <StyledAppleIcon fill="#fff" /> Apple
          </AppleButton>
          <GoogleButton onClick={googleAuth}>
            <StyledGoogleIcon fill="" width="21.395px" /> Google
          </GoogleButton>
          <FacebookButton onClick={fbAuth}>
            <StyledFacebookIcon fill="#fff" /> Facebook
          </FacebookButton>
        </SocialButtons>
      </FormFlexBlock>
    </FlexBlockInner>
  );
};
