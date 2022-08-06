import React from "react";
import { ThemeProvider } from "styled-components";
import media from "./media";
const Theme = ({ children }) => (
  <ThemeProvider
    theme={{
      primaryFont: "SFProDisplayRegular",
      secondaryFont: "SFProDisplayBold",
      textColor: "#fff",
      backgroundColor: "#111",
      borderColor: "#fff",
      margin:"20px"
      ...media,
    }}
  >
    {children}
  </ThemeProvider>
);
export default Theme;
