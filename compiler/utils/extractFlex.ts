import { PageElementStyle } from '@shared/typing';
import { FlexDirectionOption } from '../../src/features/editor/panels/SettingsPanel';

export const extractFlex = (style: CSSStyleDeclaration): Partial<PageElementStyle> => ({
  display: 'flex',
  flexDirection: (style.flexDirection as FlexDirectionOption) || 'row',
  alignItems: style.alignItems || 'flex-start',
  justifyContent: style.justifyContent || 'flex-start'
});
