import { createDomTree } from './helpers';
import { state } from './model';

export const insertElement = (newElement, parentElement) => {
  if (newElement.tagName === 'SECTION') {
    document.querySelector('#root').append(newElement);
  } else {
    parentElement.append(newElement);
  }
};

export const renderElements = (elements, doc) => {
  const root = doc ? doc.body : document.querySelector('#root');
  root.innerHTML = '';

  for (const el of elements) {
    const node = createDomTree(el);
    root.append(node);
  }
};

export const positionDragButton = (height) => {
  const dragButton = document.querySelector('#dragTargetButton');

  if (dragButton) {
    dragButton.style.transform = `translateZ(0px) translate(-2px, ${height + 16 + 'px'})`;
  }
};

export const insertDragButton = () => {
  const img = document.createElement('img');
  img.id = 'dragTargetButton';
  img.src = '/move.png';
  document.querySelector('.moveable-control')?.append(img);
};

export const updateTargetStyle = (styles) => {
  for (const [prop, value] of styles) {
    state.currentTarget.style[prop] = value;
  }
};
