import { ElementNames, FONT_WEIGHT_VALUES, Tags } from '@shared/constants';
import type { GridElement, PageElement } from '@shared/types';
import { CSS_SIZES } from '../../constants';
import { state } from '../../model';

export const generateInlineStyles = (element: Partial<PageElement>) => {
  const style: Partial<CSSStyleDeclaration> = {};

  const {
    left,
    top,
    backgroundColor,
    color,
    fontFamily,
    fontWeight,
    fontSize,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderColor,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    textAlign,
    justifyContent,
    alignItems,
    rotate,
    scaleY,
    scaleX
  } = element;

  if (left !== undefined) style.left = `${left}px`;
  if (top !== undefined) style.top = `${top}px`;
  if (paddingTop) style.paddingTop = `${paddingTop}px`;
  if (paddingRight) style.paddingRight = `${paddingRight}px`;
  if (paddingBottom) style.paddingBottom = `${paddingBottom}px`;
  if (paddingLeft) style.paddingLeft = `${paddingLeft}px`;
  if (marginTop) style.marginTop = `${marginTop}px`;
  if (marginRight) style.marginRight = `${marginRight}px`;
  if (marginBottom) style.marginBottom = `${marginBottom}px`;
  if (marginLeft) style.marginLeft = `${marginLeft}px`;
  if (left !== undefined || top !== undefined) style.position = 'relative';
  if (rotate !== undefined) style.rotate = `${rotate}deg`;
  if (scaleX !== undefined) style.scale = `${scaleX} 1`;
  if (scaleY !== undefined) style.scale = `1 ${scaleY}`;
  if (textAlign) style.textAlign = textAlign;
  if (justifyContent) style.justifyContent = justifyContent;
  if (alignItems) style.alignItems = alignItems;
  if (justifyContent || alignItems) style.display = 'flex';
  if (backgroundColor) style.backgroundColor = backgroundColor;
  if (color) style.color = color;
  if (fontFamily) style.fontFamily = fontFamily;
  if (fontWeight) style.fontWeight = FONT_WEIGHT_VALUES[fontWeight];
  if (fontSize !== undefined) style.fontSize = fontSize === 'Inherit' ? fontSize : `${fontSize}px`;
  if (borderTop) style.borderTop = borderTop;
  if (borderRight) style.borderRight = borderRight;
  if (borderBottom) style.borderBottom = borderBottom;
  if (borderLeft) style.borderLeft = borderLeft;
  if (borderColor) style.borderColor = borderColor;

  if ((element.name || state.targetName) === ElementNames.Grid) {
    generateGridStyles(element as GridElement, style);
  }

  generateSizeStyles(element, style);

  return style;
};

const generateGridStyles = (element: Partial<GridElement>, style: Partial<CSSStyleDeclaration>) => {
  const { display, columns, columnWidth, rows, rowHeight, columnGap, rowGap } = element;

  if (display) style.display = display;
  if (columns) style.gridTemplateColumns = `repeat(${columns}, ${columnWidth === 'auto' ? '1fr' : `${columnWidth}px`})`;
  if (rows) style.gridTemplateRows = `repeat(${rows}, ${rowHeight === 'auto' ? '1fr' : `${rowHeight}px`})`;
  if (columnGap) style.columnGap = `${columnGap}px`;
  if (rowGap) style.rowGap = `${rowGap}px`;
};

const generateSizeStyles = (element: Partial<PageElement>, style: Partial<CSSStyleDeclaration>) => {
  const { tag, width, height } = element;
  const tagIsUl = tag?.toUpperCase() === Tags.Ul;

  if (width !== undefined) {
    const w = CSS_SIZES[width as keyof typeof CSS_SIZES]?.replace('vh', 'vw') || `${width}px`;
    if (tagIsUl) {
      style.minWidth = w;
    } else {
      style.width = w;
    }
  }

  if (height !== undefined) {
    const h = CSS_SIZES[height as keyof typeof CSS_SIZES] || `${height}px`;
    if (tagIsUl) {
      style.minHeight = h;
    } else {
      style.height = h;
    }
  }
};
