import { FONT_WEIGHT_VALUES, RESPONSIVE_PROPS } from '@shared/constants';
import type { DeviceType, GridElement, PageElement } from '@shared/types';
import { CSS_SIZES } from '../../constants';
import { getNextBreakpoint } from '../../utils/getNextBreakpoint';
import { getScreenBreakpoint } from '../../utils/getScreenBreakpoint';

const PIXEL_STYLE_KEYS = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'borderWidth',
  'borderRadius'
];

const PLAIN_STYLE_KEYS = [
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderColor',
  'backgroundColor',
  'color',
  'fontFamily',
  'textAlign',
  'zIndex'
] as const;

export const generateInlineStyles = (element: Partial<PageElement>, isResponsive: boolean = false) => {
  const style: Partial<CSSStyleDeclaration> = {};
  const responsiveProps = extractResponsiveProps(element, isResponsive);
  const { left, top, fontWeight, fontSize, rotate, scaleY, scaleX } = responsiveProps;

  for (const key of PIXEL_STYLE_KEYS) {
    const value = responsiveProps[key];
    if (value !== undefined) {
      style[key] = `${value}px`;
    }
  }

  for (const key of PLAIN_STYLE_KEYS) {
    const value = responsiveProps[key];
    if (value) {
      style[key] = value;
    }
  }

  if ((isDefined(left) && isDefined(top)) || isDefined(rotate)) {
    style.transform = `translate(${left}px, ${top}px) rotate(${rotate || 0}deg)`;
  }

  if (isDefined(left) || isDefined(top)) style.position = 'relative';
  if (isDefined(scaleX)) style.scale = `${scaleX} 1`;
  if (isDefined(scaleY)) style.scale = `1 ${scaleY}`;
  if (fontWeight) style.fontWeight = FONT_WEIGHT_VALUES[fontWeight as keyof typeof FONT_WEIGHT_VALUES];
  if (isDefined(fontSize)) style.fontSize = fontSize === 'Inherit' ? fontSize : `${fontSize}px`;

  maybeGenerateSizeStyles(element, style, isResponsive);
  maybeGenerateFlexStyles(element, style, isResponsive);
  maybeApplyGridStyles(element as GridElement, style, isResponsive);

  return style;
};

const maybeApplyGridStyles = (
  element: Partial<GridElement>,
  style: Partial<CSSStyleDeclaration>,
  isResponsive: boolean
) => {
  const { display, columns, columnWidth, rows, rowHeight, columnGap, rowGap } = extractResponsiveProps(
    element,
    isResponsive
  );

  if (display) style.display = display;
  if (columns) style.gridTemplateColumns = `repeat(${columns}, ${columnWidth === 'auto' ? '1fr' : `${columnWidth}px`})`;
  if (rows) style.gridTemplateRows = `repeat(${rows}, ${rowHeight === 'auto' ? '1fr' : `${rowHeight}px`})`;
  if (columnGap) style.columnGap = `${columnGap}px`;
  if (rowGap) style.rowGap = `${rowGap}px`;
};

function maybeGenerateFlexStyles(
  element: Partial<PageElement>,
  style: Partial<CSSStyleDeclaration>,
  isResponsive: boolean
) {
  const { justifyContent, alignItems } = extractResponsiveProps(element, isResponsive);

  if (justifyContent) {
    style.justifyContent = justifyContent;
  }

  if (alignItems) {
    style.alignItems = alignItems;
  }

  if (justifyContent || alignItems) {
    style.display = 'flex';
    style.flexDirection = 'column';
  }
}

const maybeGenerateSizeStyles = (
  element: Partial<PageElement>,
  style: Partial<CSSStyleDeclaration>,
  isResponsive: boolean
) => {
  const { width, height } = extractResponsiveProps(element, isResponsive);

  if (isDefined(width)) {
    style.width = CSS_SIZES[width as keyof typeof CSS_SIZES]?.replace('vh', 'vw') || `${width}px`;
  }

  if (isDefined(height)) {
    style.height = CSS_SIZES[height as keyof typeof CSS_SIZES] || `${height}px`;
  }
};

const getResponsiveProp = <T>(propMap: Partial<Record<DeviceType, T>>): T | undefined => {
  let bp: DeviceType | null = getScreenBreakpoint();

  while (bp) {
    const val = propMap[bp];
    if (val !== undefined) return val;
    bp = getNextBreakpoint(bp);
  }
};

const extractResponsiveProps = (element: Partial<PageElement>, isResponsive: boolean) => {
  const result: Partial<Record<string, any>> = { ...element };

  for (const key in element) {
    if (!RESPONSIVE_PROPS.has(key)) continue;

    const prop = (element as any)[key];

    result[key] = isResponsive ? prop[getScreenBreakpoint()] || getResponsiveProp(prop) : prop['monitor'];
  }

  return result;
};

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
