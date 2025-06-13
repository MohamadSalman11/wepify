const FONT_WEIGHTS = {
  Thin: '100',
  ExtraLight: '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  SemiBold: '600',
  Bold: '700',
  ExtraBold: '800',
  Black: '900'
};

const SIZES = {
  fill: '100%',
  screen: '100vh'
};

export const generateInlineStyles = (el) => {
  const style = {};

  if (el.width !== undefined) {
    const width = SIZES[el.width] || `${el.width}px`;

    if (el.tag === 'ul') {
      style.minWidth = width;
    } else {
      style.width = width;
    }
  }

  if (el.height !== undefined) {
    const height = SIZES[el.height] || `${el.height}px`;

    if (el.tag === 'ul') {
      style.minHeight = height;
    } else {
      style.height = height;
    }
  }

  if (el.left !== undefined) style.left = `${el.left}px`;
  if (el.top !== undefined) style.top = `${el.top}px`;
  if (el.padding && el.padding?.x !== 0 && el.padding?.y !== 0) style.padding = `${el.padding.x}px ${el.padding.y}px`;
  if (el.left !== undefined || el.top !== undefined) style.position = 'relative';
  if (el.backgroundColor !== undefined) style.backgroundColor = el.backgroundColor;
  if (el.color !== undefined) style.color = el.color;
  if (el.fontFamily !== undefined) style.fontFamily = el.fontFamily;
  if (el.fontWeight !== undefined) style.fontWeight = FONT_WEIGHTS[el.fontWeight];
  if (el.fontSize !== undefined) style.fontSize = `${el.fontSize}px`;
  if (el.display !== undefined) style.display = el.display;
  if (el.columns !== undefined)
    style.gridTemplateColumns = `repeat(${el.columns}, ${el.columnWidth === 'auto' ? '1fr' : `${el.columnWidth}px`})`;
  if (el.rows !== undefined)
    style.gridTemplateRows = `repeat(${el.rows}, ${el.rowHeight === 'auto' ? '1fr' : `${el.rowHeight}px`})`;
  if (el.columnGap !== undefined) style.columnGap = `${el.columnGap}px`;
  if (el.rowGap !== undefined) style.rowGap = `${el.rowGap}px`;
  if (el.flexDir !== undefined) style.flexDirection = el.flexDir;

  if (el.borderTop) style.borderTop = el.borderTop;
  if (el.borderRight) style.borderRight = el.borderRight;
  if (el.borderBottom) style.borderBottom = el.borderBottom;
  if (el.borderLeft) style.borderLeft = el.borderLeft;

  return style;
};
