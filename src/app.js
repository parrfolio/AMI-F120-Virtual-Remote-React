import React from "react";
import { render } from "react-dom";
import { App } from "./js/components/App";
import Theme from "./js/components/Theme";

render(
  <Theme>
    <App />
  </Theme>,
  document.getElementById("app")
);
