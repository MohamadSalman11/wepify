import { css } from 'styled-components';

const baseStyles = css`
  @font-face {
    font-family: 'Roboto';
    font-weight: 400;
    src: url('../assets/fonts/roboto-regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Roboto';
    font-weight: 500;
    src: url('../assets/fonts/roboto-medium.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Roboto';
    font-weight: 600;
    src: url('../assets/fonts/roboto-semi-bold.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Roboto';
    font-weight: 700;
    src: url('../assets/fonts/roboto-bold.woff2') format('woff2');
  }

  body {
    color: var(--body-color);
    font-size: var(--body-font-size);
    font-family: var(--font-family-base);
  }

  input,
  button,
  textarea,
  select,
  a {
    &:focus {
      font-family: inherit;
      line-height: inherit;
      color: inherit;
    }
  }

  button,
  a,
  select {
    cursor: pointer;
  }
`;

export default baseStyles;
