import { createGlobalStyle } from 'styled-components';

import baseStyle from './base-styles';
import resetStyles from './reset-styles';
import variables from './variables';

const GlobalStyles = createGlobalStyle`
 ${variables}
 ${resetStyles}
 ${baseStyle}
`;

export default GlobalStyles;
