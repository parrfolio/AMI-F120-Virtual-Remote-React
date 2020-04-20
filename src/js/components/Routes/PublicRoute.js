//@flow
import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({
  component: Component,
  authed,
  user,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props: {}) =>
        authed === false ? (
          <Component {...{ authed, user, ...rest }} />
        ) : (
          <Redirect to="/my-rsd-list" />
        )
      }
    />
  );
};
