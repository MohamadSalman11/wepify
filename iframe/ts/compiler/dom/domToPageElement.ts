import { DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, ElementsName, FONT_WEIGHT_NAMES } from '@shared/constants';
import type { GridElement, InputElement, LinkElement, PageElement } from '@shared/typing';
import { rgbToHex } from '@shared/utils';
import { CSS_SIZES_NAME } from '../../constants';
import { state } from '../../model';
import { extractTransform } from '../../utils/extractTransform';
import { parseGridRepeat } from '../../utils/parseGridRepeat';

const BORDER_REGEX = /^(\d+px)\s+(\w+)\s+(.+)$/;

const RESPONSIVE_NUMBER_KEYS = [
  'flexDirection',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'justifyContent',
  'alignItems',
  'textAlign'
] as const;

export const domToPageElement = (elementNode: HTMLElement) => {
  const style = elementNode.style;
  const { id, tagName } = elementNode;

  const element: Partial<PageElement> = {
    id,
    tag: tagName.toLowerCase(),
    name: id.split('-').at(0) || ''
  };

  for (const key of RESPONSIVE_NUMBER_KEYS) {
    const value = style[key as keyof CSSStyleDeclaration] as string | undefined;

    if (value) {
      (element as any)[key] = toResponsiveValue(value);
    }
  }

  const { left, top, rotate } = extractTransform(style.transform) || {};

  element.left = toResponsiveValue(left || 0);
  element.top = toResponsiveValue(top || 0);
  element.rotate = toResponsiveValue(rotate || 0);

  if (style.columnGap) element.columnGap = toResponsiveValue(style.columnGap);
  if (style.rowGap) element.rowGap = toResponsiveValue(style.rowGap);
  if (style.color) element.color = rgbToHex(style.color);
  if (style.backgroundColor) element.backgroundColor = rgbToHex(style.backgroundColor);
  if (style.fontWeight) element.fontWeight = FONT_WEIGHT_NAMES[style.fontWeight as keyof typeof FONT_WEIGHT_NAMES];

  if (style.fontFamily) {
    const fontFamily = style.fontFamily.replace(/^["']|["']$/g, '');
    element.fontFamily = fontFamily === 'inherit' ? 'Inherit' : fontFamily;
  }

  if (style.fontSize) {
    element.fontSize = toResponsiveValue(style.fontSize === 'inherit' ? 'Inherit' : Number.parseFloat(style.fontSize));
  }

  if (style.scale) {
    element.scaleX = toResponsiveValue(Number(style.scale.split(' ')[0]));
    element.scaleY = toResponsiveValue(Number(style.scale.split(' ')[1]));
  }

  maybeApplySizeProps(element, style);
  maybeApplyBorderProps(element, style);
  maybeApplyChildren(elementNode, element);
  maybeApplyLinkProps(elementNode, element);
  maybeApplyGridProps(style, element as GridElement);
  maybeApplyInputProps(elementNode as HTMLInputElement, element as InputElement);

  return element;
};

const maybeApplySizeProps = (element: Partial<PageElement>, style: Partial<CSSStyleDeclaration>) => {
  if (style.width) {
    element.width = toResponsiveValue(
      CSS_SIZES_NAME[style.width as keyof typeof CSS_SIZES_NAME] || Number.parseFloat(style.width)
    );
  }

  if (style.height) {
    element.height = toResponsiveValue(
      CSS_SIZES_NAME[style.height as keyof typeof CSS_SIZES_NAME] || Number.parseFloat(style.height)
    );
  }
};

const maybeApplyBorderProps = (element: Partial<PageElement>, style: Partial<CSSStyleDeclaration>) => {
  const sides = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'] as const;

  for (const side of sides) {
    const borderValue = style[side];

    if (typeof borderValue === 'string' && borderValue !== 'none') {
      const match = borderValue.match(BORDER_REGEX);

      if (match) {
        const [, width, , color] = match;
        element.borderWidth = Number.parseFloat(width) ?? DEFAULT_BORDER_WIDTH;
        element.borderColor = color === 'initial' ? DEFAULT_BORDER_COLOR : rgbToHex(color);
        break;
      }
    }
  }

  for (const side of sides) {
    if (style[side]) element[side] = style[side];
  }

  if (style.borderRadius) {
    element.borderRadius = Number.parseFloat(style.borderRadius);
  }
};

const maybeApplyChildren = (elementNode: HTMLElement, element: Partial<PageElement>) => {
  const children = [...elementNode.children].map((child) => domToPageElement(child as HTMLElement)) as PageElement[];

  if (element.children && children.length > 0) {
    element.children = children;
  }
};

const maybeApplyLinkProps = (elementNode: HTMLElement, element: Partial<PageElement>) => {
  if (elementNode instanceof HTMLAnchorElement) {
    (element as LinkElement).link = elementNode.getAttribute('href') || '';
  }
};

const maybeApplyGridProps = (style: CSSStyleDeclaration, gridElement: GridElement) => {
  const { size: columnWidth, count: columns } = parseGridRepeat(style.gridTemplateColumns);
  const { size: rowHeight, count: rows } = parseGridRepeat(style.gridTemplateRows);

  if (gridElement.name !== ElementsName.Grid) return;

  if (columnWidth) gridElement.columnWidth = toResponsiveValue(columnWidth);
  if (rowHeight) gridElement.rowHeight = toResponsiveValue(rowHeight);
  if (columns) gridElement.columns = toResponsiveValue(columns);
  if (rows) gridElement.rows = toResponsiveValue(rows);

  gridElement.display = 'grid';
};

const maybeApplyInputProps = (elementNode: HTMLElement, inputElement: InputElement) => {
  if (!(elementNode instanceof HTMLInputElement)) return;

  if (elementNode.type) inputElement.type = elementNode.type;
  if (elementNode.placeholder) inputElement.placeholder = elementNode.placeholder;
};

function toResponsiveValue(value: string | number) {
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return { [state.deviceType]: Number.isNaN(parsed) ? value : parsed };
  }

  return { [state.deviceType]: value };
}
