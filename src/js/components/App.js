import React from "react";
import { Home } from "./Home";
import { About } from "./About";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GlobalFonts from "../../fonts/fonts";
import Helmet from "react-helmet";
import ResetGlobalStyles from "./ResetGlobalStyles";

export const App = () => {
  //const url = window.location.pathname; //allows me to drop the app in any subdirectory
  return (
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Record Store Day List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>

      <Switch>
        <Route exact path="/" render={(routeProps) => <Home />} />
        {/* <Route exact path="/country/:country" component={Country} /> */}
      </Switch>
      <GlobalFonts />
      <ResetGlobalStyles />
    </BrowserRouter>
  );
};
