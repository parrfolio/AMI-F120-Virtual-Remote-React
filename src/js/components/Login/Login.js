import React, { Component } from "react";
import {
  login,
  resetPassword,
  twitterAuth,
  googleAuth,
  fbAuth,
} from "./AuthFunctions";

function setErrorMsg(error) {
  return {
    loginMessage: error,
  };
}

export default class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      loginMessage: null,
    };
  }

  render() {
    let props = {
      className: "col-sm-6 col-sm-offset-3",
    };
    return (
      <div {...props}>
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              ref={(email) => (this.email = email)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              ref={(pw) => (this.pw = pw)}
            />
          </div>
          {this.state.loginMessage && (
            <div className="alert alert-danger" role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              />
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage}{" "}
              <a href="#" onClick={this.resetPassword} className="alert-link">
                Forgot Password?
              </a>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <h2>Login Social:</h2>
        <a href="#" onClick={twitterAuth}>
          Twitter
        </a>{" "}
        <a href="#" onClick={googleAuth}>
          Google
        </a>{" "}
        <a href="#" onClick={fbAuth}>
          Facebook
        </a>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    login(this.email.value, this.pw.value).catch((error) => {
      this.setState(setErrorMsg("Invalid username/password."));
    });
  }
  resetPassword() {
    resetPassword(this.email.value)
      .then(() =>
        this.setState(
          setErrorMsg(`Password reset email sent to ${this.email.value}.`)
        )
      )
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)));
  }
}
