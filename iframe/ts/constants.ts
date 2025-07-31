export const SELECTOR_TARGET = '.target';
export const SELECTOR_ROOT = '#iframe-root';
export const SELECTOR_DRAG_BUTTON_ID = 'dragTargetButton';
export const SELECTOR_DRAG_BUTTON = `#${SELECTOR_DRAG_BUTTON_ID}`;
export const CONTENT_EDITABLE_ELEMENTS = new Set(['li', 'span', 'p', 'a', 'button']);

export const CSS_SIZES = {
  fill: '100%',
  auto: 'fit-content'
} as const;

export const CSS_SIZES_NAME = {
  '100%': 'fill',
  'fit-content': 'auto'
} as const;
