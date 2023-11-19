import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GlobalFonts from "../../fonts/fonts";
import Helmet from "react-helmet";
import ResetGlobalStyles from "./ResetGlobalStyles";
import { PublicRoute } from "./Routes/PublicRoute";
import { PrivateRoute } from "./Routes/PrivateRoute";
import { useAuth } from "./AuthStateHandler";
import styled, { ThemeContext } from "styled-components";

import jukebox_data from "../../data/jukebox";
import animation_data from "../../data/animations";

import { Loading } from "./Loading";

import { About } from "./About";
import { Lights } from "./Lights";
import { Songs } from "./Songs";
import { Login } from "./Login";

const Block = styled.div`
  margin-top: 15%;
  width: 100%;
  height: 100%;
`;

export const App = () => {
  //const url = window.location.pathname; //allows me to drop the app in any subdirectory

  const { authed, user, loading } = useAuth();
  const { admin } = user;

  return loading ? (
    <Loading />
  ) : (
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Jukebox Controller - AMi F-120</title>

        <meta
          name="viewport"
          content="user-scalable=no,initial-scale=1.0,maximum-scale=1.0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Helmet>

      <Switch>
        {/* <Route exact path="/country/:country" component={Country} /> */}

        <PublicRoute
          path="/"
          exact
          component={Login}
          {...{ authed, user, admin: false, nav: false }}
        />

        <PrivateRoute
          path="/songs"
          component={Songs}
          {...jukebox_data}
          {...{ authed, user, admin: true, nav: true }}
        />

        <PrivateRoute
          path="/about"
          component={About}
          {...{ authed, user, admin }}
        />

        <PrivateRoute
          path="/lights"
          component={Lights}
          {...animation_data}
          {...{ authed, user, admin, nav: true }}
        />
      </Switch>
      <GlobalFonts />
      <ResetGlobalStyles />
    </BrowserRouter>
  );
};
