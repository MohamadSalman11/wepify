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

  .TooltipContent {
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
    box-shadow:
      hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
      hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    border-radius: 4px;
    background-color: white;
    padding: 10px 15px;
    color: var(--violet-11);
    font-size: 15px;
    line-height: 1;
    user-select: none;
  }
  .TooltipContent[data-state='delayed-open'][data-side='top'] {
    animation-name: slideDownAndFade;
  }
  .TooltipContent[data-state='delayed-open'][data-side='right'] {
    animation-name: slideLeftAndFade;
  }
  .TooltipContent[data-state='delayed-open'][data-side='bottom'] {
    animation-name: slideUpAndFade;
  }
  .TooltipContent[data-state='delayed-open'][data-side='left'] {
    animation-name: slideRightAndFade;
  }

  .TooltipArrow {
    fill: white;
  }
`;

export default baseStyles;
