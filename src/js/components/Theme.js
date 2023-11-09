import React from "react";
import { ThemeProvider } from "styled-components";
import media from "./media";
const colors = ["#fff", "rgb(211, 50, 93)"];
const Theme = ({ children }) => (
  <ThemeProvider
    theme={{
      fonts: {
        bold: "MetropolisBold",
        reg: "MetropolisRegular",
      },
      fontSizes: {
        sm: ".875rem",
        md: "1.0rem",
        lg: "1.4rem",
        xl: "2rem",
      },
      colors: {
        body: "#fff",
        logo: colors[0],
        sidebar: "#1D044F",
        light: colors[0],
        pink: colors[1],
        header: "#CA3A49",
        h1: "#333",
        h2: "#FCF3E3",
        lightgray: "#ccc",
        invalid: "#c00",
      },
      nav: {
        color: colors[0],
        fill: colors[0],
        ":hover": {
          color: colors[1],
          backgroundColor: "rgb(67, 55, 124)",
          borderRadius: "20px",
          fill: colors[1],
        },
        ":visited": {
          color: colors[0],
        },
        ":link": {
          color: colors[0],
        },
        ":visited:hover": {
          color: colors[1],
        },
      },
      links: {
        color: colors[0],
        fill: colors[0],
        ":hover": {
          color: colors[1],
          fill: colors[1],
        },
        ":visited": {
          color: colors[0],
        },
        ":link": {
          color: colors[0],
        },
        ":link:hover": {
          color: colors[1],
        },
        ":visited:hover": {
          color: colors[1],
        },
      },
      cards: {
        color: colors[0],
        fill: colors[0],
        ":hover": {
          color: colors[1],
          fill: colors[1],
        },
        ":visited": {
          color: colors[0],
        },
        ":link": {
          color: colors[0],
        },
        ":link:hover": {
          color: colors[1],
        },
        ":visited:hover": {
          color: colors[1],
        },
      },
      favorited: {
        color: "red",
        fill: "red",
      },
      backgrounds: {
        blueCyan: "linear-gradient(90deg, #2D044F, #010024)",
        pinkPurple: "linear-gradient(90deg, #010024, #010024)",
      },
      variants: {
        avatar: {
          borderRadius: "100%",
        },
      },
      shadows: {
        small: "0 0 4px rgba(0, 0, 0, .125)",
        large: "0 0 24px rgba(0, 0, 0, .125)",
      },
      buttons: {
        primary: {
          color: `${(props) => console.log(props)}`,
          bg: "red",
        },
      },
      ...media,
    }}
  >
    {children}
  </ThemeProvider>
);
export default Theme;
