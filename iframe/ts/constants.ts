export const SELECTOR_TARGET = '.target';
export const CONTENT_EDITABLE_ELEMENTS = new Set(['li', 'span', 'p', 'a', 'button']);

export const CSS_SIZES = {
  fill: '100%',
  fit: 'fit-content'
} as const;

export const CSS_SIZES_NAME = {
  '100%': 'fill',
  'fit-content': 'fit'
} as const;
