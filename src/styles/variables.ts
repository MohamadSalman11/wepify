import { css } from 'styled-components';

/**
 * Constants
 */

const COLOR_PRIMARY = '#3e7df5';
const COLOR_PRIMARY_LIGHT = '#6597f7';
const COLOR_PRIMARY_LIGHT_2 = '#a3c1fa';

const COLOR_BLACK_LIGHT = '#3f4954';

const COLOR_GRAY = '#94a3b7';
const COLOR_GRAY_LIGHT = '#aebbcb';
const COLOR_GRAY_LIGHT_2 = '#bec9d5';
const COLOR_GRAY_LIGHT_3 = '#e5e9ee';
const COLOR_GRAY_LIGHT_4 = '#f2f4f7';

const COLOR_RED = '#f45a65';
const COLOR_RED_LIGHT = 'rgba(244, 90, 100, 0.1)';

const COLOR_WHITE = '#ffffff';
const COLOR_WHITE_2 = '#EEF2F4';
const COLOR_WHITE_3 = '#f4f8f8';

/**
 * CSS variables definition
 */

const variables = css`
  :root {
    /* Colors */
    --color-primary: ${COLOR_PRIMARY};
    --color-primary-light: ${COLOR_PRIMARY_LIGHT};
    --color-primary-light-2: ${COLOR_PRIMARY_LIGHT_2};

    --color-black-light: ${COLOR_BLACK_LIGHT};

    --color-gray: ${COLOR_GRAY};
    --color-gray-light: ${COLOR_GRAY_LIGHT};
    --color-gray-light-2: ${COLOR_GRAY_LIGHT_2};
    --color-gray-light-3: ${COLOR_GRAY_LIGHT_3};
    --color-gray-light-4: ${COLOR_GRAY_LIGHT_4};

    --color-red: ${COLOR_RED};
    --color-red-light: ${COLOR_RED_LIGHT};

    --color-white: ${COLOR_WHITE};
    --color-white-2: ${COLOR_WHITE_2};
    --color-white-3: ${COLOR_WHITE_3};

    --box-shadow: rgba(63, 73, 84, 0.18) 0px 2px 4px;
    --box-shadow-2: rgba(63, 73, 84, 0.2) 0px 2px 8px 0px;

    /* Body */
    --body-font-size: var(--font-size);
    --body-color: var(--color-black-light);
    --body-bg: var(--color-white-2);
    --body-letter-spacing: var(--letter-spacing);

    /* Components */
    /* Define common padding and border radius sizes and more  */
    --padding-y: 1.2rem;
    --padding-x: 2.4rem;
    --font-size: 1.4rem;
    --white-space: nowrap;

    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    --border-width: 2px;
    --border-radius-xs: 2px;
    --border-radius-sm: 4px;
    --border-radius-md: 6px;
    --border-radius-lg: 8px;
    --border-radius-xl: 12px;
    --border-radius-xxl: 26px;
    --border-radius-full: 999px;
    --border-base: 1px solid var(--color-white-3);

    --zindex-base: 10;
    --zindex-panel: 20;
    --zindex-preview-close-button: 100;
    --z-index-tooltip: 500;
    --zindex-dropdown: 800;
    --zindex-modal: 1000;
    --zindex-loading-screen: 1200;
    --zindex-required-desktop: 1200;
    --transition-base: all 0.2s linear;

    /* Buttons */
    --btn-padding-y: var(--padding-y);
    --btn-padding-x: var(--padding-x);
    --btn-font-size: var(--font-size);
    --btn-white-space: var(--white-space);

    --btn-padding-y-sm: 0.8rem;
    --btn-padding-x-sm: 1.2rem;
    --btn-font-size-sm: 1.2rem;

    --btn-border-radius: var(--border-radius-md);

    --btn-transition: var(--transition-base);

    /* Forms */
    --input-padding-y: 1.2rem;
    --input-padding-x: 3.6rem;
    --input-font-size: var(--font-size);
    --input-border-radius: var(--border-radius-md);

    --input-padding-y-sm: 0.8rem;
    --input-padding-x-sm: var(--padding-x);
    --input-font-size-sm: var(--font-size);

    --input-padding-y-lg: 1.6rem;
    --input-padding-x-lg: 6.4rem;
    --input-font-size-lg: 1.6rem;

    /* Typography */
    --font-family-sans-serif:
      'Inter', -apple-system, system-ui, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans',
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Segoe UI Symbol';
    --font-family-base: var(--font-family-sans-serif);

    --letter-spacing: 0.5px;
    --font-size-root: 62.5%;
  }
`;

export default variables;
