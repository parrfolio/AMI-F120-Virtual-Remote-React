import React from "react";
import { Home } from "./Home";
import { UserHome } from "./UserHome";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GlobalFonts from "../../fonts/fonts";
import Helmet from "react-helmet";
import ResetGlobalStyles from "./ResetGlobalStyles";
import { PublicRoute } from "./Routes/PublicRoute";
import { PrivateRoute } from "./Routes/PrivateRoute";
import LoginForm from "./Login/Login";
import { useAuth } from "./AuthStateHandler";

export const App = () => {
  //const url = window.location.pathname; //allows me to drop the app in any subdirectory

  const { authed, user, loading } = useAuth();
  const { admin } = user;

  console.log(authed, user, loading);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Record Store Day List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>

      <Switch>
        {/* <Route exact path="/country/:country" component={Country} /> */}

        <PublicRoute
          path="/"
          exact
          component={Home}
          {...{ authed, user, admin: false }}
        />

        <PrivateRoute
          path="/my-rsd-list"
          component={UserHome}
          {...{ authed, user, admin }}
        />

        <PublicRoute
          path="/login"
          component={LoginForm}
          {...{ authed, user, admin: false }}
        />
      </Switch>
      <GlobalFonts />
      <ResetGlobalStyles />
    </BrowserRouter>
  );
};
