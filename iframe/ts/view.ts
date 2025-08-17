import { DEFAULT_SCALE_FACTOR, Tags } from '@shared/constants';
import type { PageElement } from '@shared/typing';
import { createDomTree } from './compiler/dom/createDomTree';
import { SELECTOR_DRAG_BUTTON, SELECTOR_DRAG_BUTTON_ID, SELECTOR_ROOT } from './constants';
import { getTarget } from './model';
import moveIcon from '/move.png';

const DRAG_BUTTON_OFFSET_X = -2;
const DRAG_BUTTON_OFFSET_Y = 16;
const SELECTOR_MOVEABLE_CONTROL = '.moveable-control';

export const insertElement = (element: HTMLElement, parentId?: string, domIndex?: number) => {
  const rootElement = document.querySelector(SELECTOR_ROOT);

  if (element.tagName === Tags.Section) {
    rootElement?.append(element);
    return;
  }

  const parent = (parentId && document.querySelector(`#${parentId}`)) || rootElement;

  if (!parent) return;

  parent.insertBefore(element, domIndex === undefined ? null : parent.children[domIndex] || null);
};

export const renderElements = (elements: PageElement[], doc?: Document) => {
  const container = doc ? doc.body : document.querySelector(SELECTOR_ROOT);

  if (!container) return;

  container.innerHTML = '';

  for (const el of elements) {
    const node = createDomTree(el);
    container.append(node);
  }
};

export const insertDragButton = () => {
  const img = document.createElement('img');
  img.id = SELECTOR_DRAG_BUTTON_ID;
  img.src = moveIcon;
  document.querySelector(SELECTOR_MOVEABLE_CONTROL)?.append(img);
};

export const positionDragButton = (
  elementHeight: number,
  scaleFactor: number = DEFAULT_SCALE_FACTOR,
  borderWidth?: number
) => {
  const dragButton = document.querySelector(SELECTOR_DRAG_BUTTON) as HTMLImageElement;

  if (dragButton) {
    const scale = scaleFactor === DEFAULT_SCALE_FACTOR ? 1 : scaleFactor / DEFAULT_SCALE_FACTOR;
    dragButton.style.transform = `translateZ(0px) translate(${DRAG_BUTTON_OFFSET_X}px, ${elementHeight * scale + DRAG_BUTTON_OFFSET_Y + (borderWidth || 0)}px)`;
  }
};

export const updateTargetStyle = (styles: [keyof CSSStyleDeclaration, string | number][]) => {
  const style = getTarget().style;

  for (const [prop, value] of styles) {
    (style as any)[prop] = value;
  }
};
