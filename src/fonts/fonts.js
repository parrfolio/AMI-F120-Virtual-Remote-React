import { createGlobalStyle } from "styled-components";

import SFProDisplayBoldWoff from "./SFProDisplayBold.woff";
import SFProDisplayBoldWoff2 from "./SFProDisplayBold.woff2";
import SFProDisplayRegularWoff from "./SFProDisplayRegular.woff";
import SFProDisplayRegularWoff2 from "./SFProDisplayRegular.woff2";

export default createGlobalStyle`
    @font-face {
        font-family: 'SFProDisplayBold';
        src: local('SFProDisplayBold'), local('SFProDisplayBold'),
        url(${SFProDisplayBoldWoff2}) format('woff2'),
        url(${SFProDisplayBoldWoff}) format('woff');
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'SFProDisplayRegular';
        src: local('SFProDisplayRegular'), local('SFProDisplayRegular'),
        url(${SFProDisplayRegularWoff2}) format('woff2'),
        url(${SFProDisplayRegularWoff}) format('woff');
        font-weight: 300;
        font-style: normal;
    }
`;
