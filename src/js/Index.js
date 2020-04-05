import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";
import Theme from "./components/Theme";

render(
  <Theme>
    <App />
  </Theme>,
  document.getElementById("app")
);
