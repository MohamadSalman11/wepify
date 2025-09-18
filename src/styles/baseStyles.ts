import { css } from 'styled-components';

const baseStyles = css`
  @font-face {
    font-weight: 400;
    src: url('/fonts/inter-regular.woff2') format('woff2');
    font-family: 'Inter';
  }

  @font-face {
    font-weight: 500;
    src: url('/fonts/inter-medium.woff2') format('woff2');
    font-family: 'Inter';
  }

  @font-face {
    font-weight: 600;
    src: url('/fonts/inter-semibold.woff2') format('woff2');
    font-family: 'Inter';
  }

  @font-face {
    font-weight: 700;
    src: url('/fonts/inter-bold.woff2') format('woff2');
    font-family: 'Inter';
  }

  body {
    background-color: var(--body-bg);
    color: var(--body-color);
    font-size: var(--body-font-size);
    font-family: var(--font-family-base);
    letter-spacing: var(--body-letter-spacing);
  }

  p {
    line-height: 1.5;
  }

  input,
  button,
  textarea,
  select,
  a {
    outline: none;
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
    border: none;
  }

  a {
    color: var(--color-black-light);
    text-decoration: none;
  }

  ul {
    list-style: none;
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
    width: 0.8rem;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: var(--border-radius-md);
    background-color: var(--color-gray-light-3);
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-gray-light-3);
  }
`;

export default baseStyles;
