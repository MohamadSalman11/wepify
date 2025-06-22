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

  svg {
    color: var(--color-gray);
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

  .my-masonry-grid {
    display: flex;
    flex-direction: row !important;
    gap: 1.2rem;
    width: 100%;
  }

  .my-masonry-grid_column {
    flex: 1;
  }

  .my-masonry-grid_column > div {
    margin-bottom: 12px;
  }
`;

export default baseStyles;
