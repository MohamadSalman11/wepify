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
    letter-spacing: var(--body-letter-spacing);
  }

  input,
  button,
  textarea,
  select,
  a {
    line-height: inherit;
    font-family: inherit;
    letter-spacing: inherit;
  }

  button,
  a,
  select {
    cursor: pointer;
  }

  button,
  input {
    outline: none;
    border: none;
  }

  svg {
    color: var(--color-gray);
  }

  a {
    color: var(--color-white);
  }

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: var(--border-radius-sm);
    background: var(--color-gray-dark);
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export default baseStyles;
