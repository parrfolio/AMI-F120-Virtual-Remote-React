import React from "react";
import { Home } from "./Home";
import { About } from "./About";
import { Lights } from "./Lights";
import { Songs } from "./Songs";
import { UserHome } from "./UserHome";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GlobalFonts from "../../fonts/fonts";
import Helmet from "react-helmet";
import ResetGlobalStyles from "./ResetGlobalStyles";
import { PublicRoute } from "./Routes/PublicRoute";
import { PrivateRoute } from "./Routes/PrivateRoute";
import LoginForm from "./Login/Login";
import { useAuth } from "./AuthStateHandler";
import jukebox_data from "../../data/jukebox";
import animation_data from "../../data/animations";
import { Loading } from "./Loading";

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
          component={Home}
          {...{ authed, user, admin: false, nav: false }}
        />

        <PrivateRoute
          path="/home"
          component={UserHome}
          {...jukebox_data}
          {...animation_data}
          {...{ authed, user, admin, nav: true }}
        />

        <PrivateRoute
          path="/about"
          component={About}
          {...{ authed, user, admin }}
        />

        <PrivateRoute
          path="/lights"
          component={Lights}
          {...{ authed, user, admin }}
        />
        <PrivateRoute
          path="/songs"
          component={Songs}
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
