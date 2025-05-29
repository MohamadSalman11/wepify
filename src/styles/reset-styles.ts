import { css } from 'styled-components';

const resetStyles = css`
  *,
  *::after,
  *::before {
    padding: 0;
    margin: 0;
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: var(--font-size-root);
  }
`;

export default resetStyles;
