import { FONT_WEIGHT_VALUES, RESPONSIVE_PROPS, SPACE_VALUES } from '@shared/constants';
import type { DeviceType, GridElement, PageElement } from '@shared/typing';
import { CSS_SIZES } from '../../constants';
import { getNextBreakpoint } from '../../utils/getNextBreakpoint';
import { getScreenBreakpoint } from '../../utils/getScreenBreakpoint';
import { isDefined } from '../../utils/isDefined';

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
  'borderRadius',
  'rowGap',
  'columnGap'
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
  'alignItems',
  'zIndex'
] as const;

export const generateInlineStyles = ({
  element,
  deviceType,
  isResponsive = false
}: {
  element: Partial<PageElement>;
  deviceType?: DeviceType;
  isResponsive?: boolean;
}) => {
  const style: Partial<CSSStyleDeclaration> = {};
  const responsiveProps = extractResponsiveProps(element, isResponsive, deviceType);
  const { left, top, fontWeight, fontSize, rotate, scaleY, scaleX, zIndex, justifyContent, flexDirection } =
    responsiveProps;
  const shouldTransform = (isDefined(left) && isDefined(top)) || isDefined(rotate);

  for (const key of PIXEL_STYLE_KEYS) {
    const value = responsiveProps[key];
    if (value !== undefined) {
      style[key as any] = `${value}px`;
    }
  }

  for (const key of PLAIN_STYLE_KEYS) {
    const value = responsiveProps[key];
    if (value) {
      style[key] = value;
    }
  }

  if (shouldTransform) {
    style.transform = `translate(${left}px, ${top}px) rotate(${rotate || 0}deg)`;
  }

  if (flexDirection) {
    style.display = 'flex';
    style.flexDirection = flexDirection;
  }

  if (justifyContent) {
    style.justifyContent = SPACE_VALUES.includes(justifyContent) ? `space-${justifyContent}` : justifyContent;
  }

  if (isDefined(zIndex)) style.position = 'relative';
  if (isDefined(scaleX)) style.scale = `${scaleX} 1`;
  if (isDefined(scaleY)) style.scale = `1 ${scaleY}`;
  if (fontWeight) style.fontWeight = FONT_WEIGHT_VALUES[fontWeight as keyof typeof FONT_WEIGHT_VALUES];
  if (isDefined(fontSize)) style.fontSize = fontSize === 'Inherit' ? fontSize : `${fontSize}px`;

  maybeGenerateSizeStyles(element, style, isResponsive, deviceType);
  maybeGenerateFlexStyles(element, style, isResponsive, deviceType);
  maybeApplyGridStyles(element as GridElement, style, isResponsive);

  return style;
};

const maybeApplyGridStyles = (
  element: Partial<GridElement>,
  style: Partial<CSSStyleDeclaration>,
  isResponsive: boolean
) => {
  const { display, columns, columnWidth, rows, rowHeight } = extractResponsiveProps(element, isResponsive);

  if (display) style.display = display;
  if (columns) style.gridTemplateColumns = `repeat(${columns}, ${columnWidth === 'auto' ? '1fr' : `${columnWidth}px`})`;
  if (rows) style.gridTemplateRows = `repeat(${rows}, ${rowHeight === 'auto' ? '1fr' : `${rowHeight}px`})`;
};

const maybeGenerateFlexStyles = (
  element: Partial<PageElement>,
  style: Partial<CSSStyleDeclaration>,
  isResponsive: boolean,
  deviceType?: DeviceType
) => {
  const { justifyContent, alignItems, flexDirection } = extractResponsiveProps(element, isResponsive, deviceType);

  if (justifyContent || alignItems) {
    style.display = 'flex';
    style.flexDirection = flexDirection || 'column';
  }
};

const maybeGenerateSizeStyles = (
  element: Partial<PageElement>,
  style: Partial<CSSStyleDeclaration>,
  isResponsive: boolean,
  deviceType?: DeviceType
) => {
  const { width, height } = extractResponsiveProps(element, isResponsive, deviceType);

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

const extractResponsiveProps = (element: Partial<PageElement>, isResponsive: boolean, deviceType?: DeviceType) => {
  const result: Partial<Record<string, any>> = { ...element };

  for (const key in element) {
    if (!RESPONSIVE_PROPS.has(key)) continue;

    const prop = (element as any)[key];

    if (deviceType && prop[deviceType]) {
      result[key] = prop[deviceType];
    } else {
      result[key] = isResponsive ? prop[getScreenBreakpoint()] || getResponsiveProp(prop) : prop['monitor'];
    }
  }

  return result;
};
