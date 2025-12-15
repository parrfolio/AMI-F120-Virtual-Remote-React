import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
  box-sizing: border-box;
  outline:none
}

ul[class],
ol[class] {
  padding: 0;
}

body,
h1,
h2,
h3,
h4,
p,
ul[class],
ol[class],
li,
figure,
figcaption,
blockquote,
dl,
dd {
  margin: 0;
}

html, body {
  height:100%;
  color: ${(props) => `${props.theme.textColor}`};
  background-color: ${(props) => `${props.theme.backgroundColor}`};
}

body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -moz-font-feature-settings: 'liga','kern';
    font-size:10px;
    overflow:auto;
    font-family: ${(props) => props.theme.primaryFont};
    /* ${({ theme }) => theme.mamabear`font-size:8px; overflow-y:hidden;`} */

    
    
  }

  body:before {
  content: "";
  display: block;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  background-color: #fff;
  background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 45%
    ),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E %3Cpath d='M3.10387 2.82609L4.96377 2.54831C5.01208 2.53623 5.01208 2.46377 4.96377 2.46377L3.10387 2.18599C2.95894 2.16184 2.85024 2.05314 2.82609 1.90821L2.53623 0.0362319C2.52415 -0.0120773 2.45169 -0.0120773 2.45169 0.0362319L2.17391 1.89614C2.14976 2.04106 2.04106 2.14976 1.89614 2.17391L0.0362319 2.45169C-0.0120773 2.46377 -0.0120773 2.53623 0.0362319 2.53623L1.89614 2.81401C2.04106 2.83816 2.14976 2.94686 2.17391 3.09179L2.45169 4.95169C2.46377 5 2.53623 5 2.53623 4.95169L2.81401 3.09179C2.83816 2.95894 2.95894 2.85024 3.10387 2.82609Z' fill='black'/%3E %3C/svg%3E");
  background-repeat: 100% 100%;
}

  ul[class],
  ol[class] {
    list-style: none;
  }

  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  img {
    max-width: 100%;
    display: block;
  }

  article > * + * {
    margin-top: 1em;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  } 
`;
