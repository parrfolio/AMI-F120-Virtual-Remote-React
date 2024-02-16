import { createGlobalStyle } from "styled-components";

import MetropolisBoldWoff from "./MetropolisBold.woff";
import MetropolisBoldWoff2 from "./MetropolisBold.woff2";
import MetropolisRegularWoff from "./MetropolisRegular.woff";
import MetropolisRegularWoff2 from "./MetropolisRegular.woff2";

export default createGlobalStyle`
    @font-face {
        font-family: 'MetropolisBold';
        src: local('MetropolisBold'), local('MetropolisBold'),
        url(${MetropolisBoldWoff2}) format('woff2'),
        url(${MetropolisBoldWoff}) format('woff');
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'MetropolisRegular';
        src: local('MetropolisRegular'), local('MetropolisRegular'),
        url(${MetropolisRegularWoff2}) format('woff2'),
        url(${MetropolisRegularWoff}) format('woff');
        font-weight: 300;
        font-style: normal;
    }
`;
