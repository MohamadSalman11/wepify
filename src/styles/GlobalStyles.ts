import { createGlobalStyle } from 'styled-components';

import baseStyle from './baseStyles';
import resetStyles from './resetStyles';
import variables from './variables';

const GlobalStyles = createGlobalStyle`
 ${variables}
 ${resetStyles}
 ${baseStyle}
`;

export default GlobalStyles;
