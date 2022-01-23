import React from "react";
import { ThemeProvider } from "styled-components";
import media from "./media";
const Theme = ({ children }) => (
  <ThemeProvider
    theme={{
      primaryFont: "SFProDisplayRegular",
      secondaryFont: "SFProDisplayBold",
      textColor: "#333",
      backgroundColor: "#900",
      borderColor: "#333",
      ...media,
    }}
  >
    {children}
  </ThemeProvider>
);
export default Theme;
