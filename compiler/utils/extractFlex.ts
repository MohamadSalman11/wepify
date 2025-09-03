import { PageElementStyle } from '@shared/typing';
import { FlexDirectionOption } from '../../src/features/editor/panels/SettingsPanel';

export const extractFlex = (style: CSSStyleDeclaration): Partial<PageElementStyle> => ({
  display: 'flex',
  flexDirection: (style.flexDirection as FlexDirectionOption) || 'column',
  alignItems: style.alignItems || 'stretch',
  justifyContent: style.justifyContent || 'flex-start'
});
