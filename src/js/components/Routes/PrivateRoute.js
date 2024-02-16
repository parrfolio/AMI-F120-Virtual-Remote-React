//@flow
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({
  component: Component,
  authed,
  user,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props: {
        location: { pathname: string, search: string, hash: string },
      }) =>
        authed === true ? (
          <Component {...{ authed, user, ...rest }} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );
};
