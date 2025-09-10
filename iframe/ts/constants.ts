export const ID_CONTEXT_MENU = 'context-menu';
export const SELECTOR_SECTION = 'section';
export const SELECTOR_ROOT = '#iframe-root';
export const SELECTOR_DRAG_BUTTON_ID = 'dragTargetButton';
export const SELECTOR_DRAG_BUTTON = `#${SELECTOR_DRAG_BUTTON_ID}`;
export const SELECTOR_CONTEXT_MENU = `#${ID_CONTEXT_MENU}`;

export enum ContextMenuAction {
  Copy = 'copy',
  Paste = 'paste',
  BringToFront = 'bring-to-front',
  SendToBack = 'send-to-back',
  AllowOverlap = 'allow-overlap',
  Delete = 'delete'
}

export const CSS_SIZES = {
  fill: '100%',
  screen: '100vh',
  auto: 'fit-content'
} as const;

export const CSS_SIZES_NAME = {
  '100%': 'fill',
  '100vh': 'screen',
  'fit-content': 'auto'
} as const;
