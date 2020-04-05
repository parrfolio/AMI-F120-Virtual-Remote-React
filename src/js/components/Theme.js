import React from "react";
import { ThemeProvider } from "styled-components";
import media from "./media";
const Theme = ({ children }) => (
  <ThemeProvider
    theme={{
      primaryFont: "SFProDisplayRegular",
      secondaryFont: "SFProDisplayBold",
      textColor: "#555",
      primaryColor: "#00A9E6",
      secondaryColor: "#FFAA00",
      fontSize: { xsm: ".8em", sm: "1em", md: "1.5em", lg: "2em" },
      backgroundColor: "#fff",
      borderColor: "#777",
      linkColor: "red",
      ...media
    }}
  >
    {children}
  </ThemeProvider>
);
export default Theme;
