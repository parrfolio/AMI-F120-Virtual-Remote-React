import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
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

const FlexBlockInner = styled.div`
  order: 0;
  flex: 0 1 auto;
  align-self: stretch;
`;
const FormFlexBlock = styled(FlexBlockInner)`
  align-self: auto;
  place-content: center;
  display: grid;
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

const Form = styled.form`
  width: ${(props) => props.theme.infantbear};
`;

const Label = styled.label`
  color: ${(props) => props.theme.colors.h1};
  display: block;
  padding: 0.5rem;
  font-family: ${(props) => props.theme.fonts.reg};
  font-size: ${(props) => props.theme.fontSizes.mdlg};
`;

const Input = styled.input`
  color: ${(props) => props.theme.colors.h1};
  padding: 0.5rem;
  font-family: ${(props) => props.theme.fonts.reg};
  font-size: ${(props) => props.theme.fontSizes.sm};
  border-radius: 4px;
  border: 1px solid var(--neutral-almost-white, #eee);
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

const Button = styled.button`
  display: flex;
  width: 272px;
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

const StyledFacebookIcon = styled(FacebookIcon)`
  width: 21.395px;
  height: 21.395px;
  flex-shrink: 0;
`;

const FacebookButton = styled(Button)`
  background: #1877f2;
`;

const StyledAppleIcon = styled(AppleIcon)`
  width: 21.395px;
  height: 21.395px;
  flex-shrink: 0;
`;

const AppleButton = styled(Button)`
  background: #000;
`;

const StyledGoogleIcon = styled(GoogleIcon)`
  width: 21.395px;
  height: 21.395px;
  flex-shrink: 0;
`;

const GoogleButton = styled(Button)`
  background: #fff;
  color: rgba(0, 0, 0, 0.54);
  border-radius: 8.914px;
  background: #fff;
  box-shadow: 0px 1.7828948497772217px 2.674342155456543px 0px
      rgba(0, 0, 0, 0.17),
    0px 0px 2.674342155456543px 0px rgba(0, 0, 0, 0.08);
`;

export const LoginForm = (props, state) => {
  const [loginMessage, setloginMessage] = useState();
  const setErrorMsg = (error) => {
    setloginMessage(error);
  };
  const handleSubmit = (e) => {
    // e.preventDefault();
    login(this.email.value, this.pw.value).catch((error) => {
      this.setState(setErrorMsg("Invalid username/password."));
    });
  };
  const resetPassword = () => {
    resetPassword(this.email.value)
      .then(() =>
        this.setState(
          setErrorMsg(`Password reset email sent to ${this.email.value}.`)
        )
      )
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)));
  };
  return (
    <FlexBlockInner>
      <H1>Jukebox Remote Login</H1>
      <FormFlexBlock>
        <form onSubmit={handleSubmit.bind(this)}>
          <div className="form-group">
            <Label>Email</Label>
            <Input
              type="text"
              className="form-control"
              ref={(email) => (email = email)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <Label>Password</Label>
            <Input
              type="password"
              className="form-control"
              placeholder="Password"
              ref={(pw) => (pw = pw)}
            />
          </div>
          {loginMessage && (
            <div className="alert alert-danger" role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              />
              <span className="sr-only">Error:</span>
              &nbsp;{loginMessage}{" "}
              <a href="#" onClick={this.resetPassword} className="alert-link">
                Forgot Password?
              </a>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        {/* <AppleButton onClick={appleAuth}>
          <StyledAppleIcon fill="#fff" /> Apple
        </AppleButton> */}
        <GoogleButton onClick={googleAuth}>
          <StyledGoogleIcon fill="" width="21.395px" /> Google
        </GoogleButton>
        <FacebookButton onClick={fbAuth}>
          <StyledFacebookIcon fill="#fff" /> Facebook
        </FacebookButton>
      </FormFlexBlock>
    </FlexBlockInner>
  );
};
