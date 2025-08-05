import { css } from 'styled-components';

const baseStyles = css`
  @font-face {
    font-weight: 300;
    src: url('/fonts/inter-light.woff2') format('woff2');
    font-family: 'Inter';
  }

  @font-face {
    font-weight: var(--font-weight-regular);
    src: url('/fonts/inter-bold.woff2') format('woff2');
    font-family: 'Inter';
  }

  @font-face {
    font-weight: var(--font-weight-medium);
    src: url('/fonts/inter-medium.woff2') format('woff2');
    font-family: 'Inter';
  }

  @font-face {
    font-weight: var(--font-weight-semibold);
    src: url('/fonts/inter-semibold.woff2') format('woff2');
    font-family: 'Inter';
  }

  @font-face {
    font-weight: var(--font-weight-bold);
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
    background-color: var(--color-gray-light-2);
  }

  .TooltipContent {
    z-index: 100;
    animation-duration: 0.2s;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius-md);
    background-color: var(--color-primary-light);
    padding: 1rem 1.2rem;
    color: var(--color-white);
    font-size: 1.4rem;
    user-select: none;
  }

  .TooltipArrow {
    z-index: var(--zindex-tooltip);
    fill: var(--color-primary-light);
  }
`;

export default baseStyles;
