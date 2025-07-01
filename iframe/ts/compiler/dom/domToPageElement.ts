import { ElementNames, FONT_WEIGHT_NAMES, Tags } from '@shared/constants';
import type { GridElement, InputElement, LinkElement, PageElement } from '@shared/types';
import { CONTENT_EDITABLE_ELEMENTS, CSS_SIZES_NAME } from '../../constants';
import { state } from '../../model';
import { parseGridRepeat } from '../../utils/parseGridRepeat';
import { rgbToHex } from '../../utils/rgbToHex';

export function domToPageElement(elementNode: HTMLElement): PageElement {
  const style = elementNode.style;
  const { id, tagName } = elementNode;
  const fontFamily = style.fontFamily.replace(/^["']|["']$/g, '');

  const element: PageElement = {
    id,
    tag: tagName.toLowerCase(),
    name: id.split('-').at(0) || '',
    left: parseNumber(style.left),
    top: parseNumber(style.top),
    color: rgbToHex(style.color),
    backgroundColor: rgbToHex(style.backgroundColor),
    fontSize: style.fontSize === 'inherit' ? 'Inherit' : Number.parseFloat(style.fontSize),
    fontFamily: fontFamily === 'inherit' ? 'Inherit' : fontFamily,
    fontWeight: FONT_WEIGHT_NAMES[style.fontWeight as keyof typeof FONT_WEIGHT_NAMES],
    padding: {
      x: Number.parseFloat(style.paddingLeft),
      y: Number.parseFloat(style.paddingTop)
    },
    marginTop: Number.parseFloat(style.marginTop || '0'),
    marginRight: Number.parseFloat(style.marginRight || '0'),
    marginBottom: Number.parseFloat(style.marginBottom || '0'),
    marginLeft: Number.parseFloat(style.marginLeft || '0'),
    paddingTop: Number.parseFloat(style.paddingTop || '0'),
    paddingRight: Number.parseFloat(style.paddingRight || '0'),
    paddingBottom: Number.parseFloat(style.paddingBottom || '0'),
    paddingLeft: Number.parseFloat(style.paddingLeft || '0')
  };

  if (style.scale) {
    element.scaleX = Number(style.scale.split(' ')[0]);
    element.scaleY = Number(style.scale.split(' ')[1]);
  }

  if (style.rotate) {
    element.rotate = Number.parseFloat(style.rotate);
  }

  if (style.justifyContent) {
    element.justifyContent = style.justifyContent;
  }

  if (style.alignItems) {
    element.alignItems = style.alignItems;
  }

  if (style.textAlign) {
    element.textAlign = style.textAlign;
  }

  if (style.width) {
    element.width = CSS_SIZES_NAME[style.width as keyof typeof CSS_SIZES_NAME] || parseNumber(style.width);
  }

  if (style.height) {
    element.height = CSS_SIZES_NAME[style.height as keyof typeof CSS_SIZES_NAME] || parseNumber(style.height);
  }

  if (CONTENT_EDITABLE_ELEMENTS.has(element.tag)) {
    element.content = elementNode.textContent || '';
  }

  assignBorderStylesIfNeeded(elementNode, element, style);

  if (state.targetName === ElementNames.Grid) {
    assignGridStyles(style, element as GridElement);
  }

  if (elementNode.tagName === Tags.A && elementNode instanceof HTMLAnchorElement) {
    (element as LinkElement).link = elementNode.getAttribute('href');
  }

  if (elementNode.tagName === Tags.Input && elementNode instanceof HTMLInputElement) {
    assignInputStyles(elementNode, element as InputElement);
  }

  assignChildrenIfNeeded(elementNode, element);

  return element;
}

const assignBorderStylesIfNeeded = (
  elementNode: HTMLElement,
  element: Partial<PageElement>,
  style: Partial<CSSStyleDeclaration>
) => {
  const { borderTop, borderRight, borderBottom, borderLeft, borderColor } = style;
  const strokeColor =
    borderColor || (borderTop || borderRight || borderBottom || borderLeft)?.match(/rgb\([^)]+\)/)?.[0];

  if (elementNode.dataset.borderColor) {
    element.borderColor = elementNode.dataset.borderColor;
  }

  if (strokeColor) {
    element.borderColor = rgbToHex(strokeColor);
  }

  if (borderTop) {
    element.borderTop = borderTop;
  }
  if (borderRight) {
    element.borderRight = borderRight;
  }
  if (borderBottom) {
    element.borderBottom = borderBottom;
  }
  if (borderLeft) {
    element.borderLeft = borderLeft;
  }
};

const assignGridStyles = (style: CSSStyleDeclaration, gridElement: GridElement) => {
  const { size: columnWidth, count: columns } = parseGridRepeat(style.gridTemplateColumns);
  const { size: rowHeight, count: rows } = parseGridRepeat(style.gridTemplateRows);

  gridElement.display = 'grid';
  gridElement.columnGap = Number.parseFloat(style.columnGap);
  gridElement.rowGap = Number.parseFloat(style.rowGap);
  gridElement.columnWidth = columnWidth;
  gridElement.rowHeight = rowHeight;
  gridElement.columns = columns;
  gridElement.rows = rows;
};

const assignInputStyles = (elementNode: HTMLInputElement, inputElement: InputElement) => {
  inputElement.type = elementNode.type || 'text';
  inputElement.placeholder = elementNode.placeholder || '';
};

const assignChildrenIfNeeded = (elementNode: HTMLElement, element: PageElement) => {
  const children = [...elementNode.children].map((child) => domToPageElement(child as HTMLElement));

  if (children.length > 0) {
    element.children = children;
  }
};

const parseNumber = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return parsed % 1 === 0 || value.split('.')[1]?.length <= 1 ? parsed : Number(parsed.toFixed(1));
};
