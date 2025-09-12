import { PageElement, PageElementStyle } from '@shared/typing';

const DEFAULT_STYLE: Partial<PageElementStyle> = {
  position: 'static',
  left: 0,
  top: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  textAlign: 'start',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  columnGap: 0,
  rowGap: 0,
  columns: 0,
  rows: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  borderWidth: 0,
  borderTop: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  borderLeft: 'none',
  borderRadius: 0,
  zIndex: 0
};

export const cleanElement = (el: PageElement) => {
  for (const key in el) {
    const k = key as keyof PageElement;
    const value = el[k];
    const shouldDelete = value === '' || value == null;

    if (shouldDelete) {
      delete el[k];
    } else if (k === 'style' && value) {
      cleanStyle(value as PageElementStyle);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      cleanElement(value as PageElement);
      if (Object.keys(value).length === 0) delete el[k];
    }
  }
};

const cleanStyle = (style: PageElementStyle) => {
  for (const key in style) {
    const k = key as keyof PageElementStyle;
    const value = style[k];
    const shouldDelete = value === '' || value == null || value === DEFAULT_STYLE[k];

    if (shouldDelete) {
      delete style[k];
    }
  }
};
