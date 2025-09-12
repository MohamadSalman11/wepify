export const SELECTOR_SECTION = 'section';
export const SELECTOR_ROOT = '#iframe-root';

export enum ContextMenuAction {
  Copy = 'copy',
  Paste = 'paste',
  BringToFront = 'bring-to-front',
  SendToBack = 'send-to-back',
  ToggleOverlap = 'toggle-overlap',
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
