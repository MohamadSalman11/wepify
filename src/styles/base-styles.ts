import { css } from 'styled-components';

const baseStyles = css`
  @font-face {
    font-weight: var(--font-weight-regular);
    src: url('src/assets/fonts/roboto-regular.woff2') format('woff2');
    font-family: 'Roboto';
  }

  @font-face {
    font-weight: var(--font-weight-medium);
    src: url('src/assets/fonts/roboto-medium.woff2') format('woff2');
    font-family: 'Roboto';
  }

  @font-face {
    font-weight: var(--font-weight-semibold);
    src: url('src/assets/fonts/roboto-semi-bold.woff2') format('woff2');
    font-family: 'Roboto';
  }

  @font-face {
    font-weight: var(--font-weight-bold);
    src: url('src/assets/fonts/roboto-bold.woff2') format('woff2');
    font-family: 'Roboto';
  }

  body {
    background-color: var(--body-bg);
    color: var(--body-color);
    font-size: var(--body-font-size);
    font-family: var(--font-family-base);
  }

  input,
  button,
  textarea,
  select,
  a {
    line-height: inherit;
    font-family: inherit;
  }

  button,
  a,
  select {
    cursor: pointer;
  }
`;

export default baseStyles;
