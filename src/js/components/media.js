import { css } from "styled-components";
const sizes = {
  papabear: 1199.98,
  brotherbear: 991.98,
  mamabear: 767.98,
  babybear: 575.98,
  infantbear: 256.98,
};
export default Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});
