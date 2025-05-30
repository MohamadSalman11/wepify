import { css } from 'styled-components';

const resetStyles = css`
  *,
  *::after,
  *::before {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  html {
    box-sizing: border-box;
    font-size: var(--font-size-root);
  }
`;

export default resetStyles;
