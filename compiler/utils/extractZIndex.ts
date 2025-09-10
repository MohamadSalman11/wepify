import { PageElementStyle } from '@shared/typing';

export const extractZIndex = (style: CSSStyleDeclaration): Partial<PageElementStyle> => ({
  position: (style.position as PageElementStyle['position']) || 'relative'
});
