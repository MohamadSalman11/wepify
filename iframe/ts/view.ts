import { Tags } from '@shared/constants';
import type { PageElement } from '@shared/types';
import { createDomTree } from './compiler/dom/createDomTree';
import { getTarget } from './model';
import moveIcon from '/move.png';

const SELECTION_ROOT = '#iframe-root';
const SELECTION_MOVEABLE_CONTROL = '.moveable-control';
const SELECTION_DRAG_BUTTON_ID = 'dragTargetButton';
export const SELECTION_DRAG_BUTTON = `#${SELECTION_DRAG_BUTTON_ID}`;

export const insertElement = (element: HTMLElement, parentElement: HTMLElement | null) => {
  const rootElement = document.querySelector(SELECTION_ROOT);

  if (!parentElement) return;

  if (element.tagName === Tags.Section) {
    rootElement?.append(element);
  } else {
    parentElement.append(element);
  }
};

export const renderElements = (elements: PageElement[], doc?: Document) => {
  const container = doc ? doc.body : document.querySelector(SELECTION_ROOT);

  if (!container) return;

  container.innerHTML = '';

  for (const el of elements) {
    const node = createDomTree(el);
    container.append(node);
  }
};

export const insertDragButton = () => {
  const img = document.createElement('img');
  img.id = SELECTION_DRAG_BUTTON_ID;
  img.src = moveIcon;
  document.querySelector(SELECTION_MOVEABLE_CONTROL)?.append(img);
};

export const positionDragButton = (elementHeight: number, scaleFactor: number) => {
  const dragButton = document.querySelector(SELECTION_DRAG_BUTTON) as HTMLImageElement;

  if (dragButton) {
    const scale = scaleFactor === 100 ? 1 : scaleFactor / 100;
    dragButton.style.transform = `translateZ(0px) translate(-2px, ${elementHeight * scale + 16}px)`;
  }
};

export const updateTargetStyle = (styles: [keyof CSSStyleDeclaration, string | number][]) => {
  const style = getTarget().style;

  for (const [prop, value] of styles) {
    (style as any)[prop] = value;
  }
};
