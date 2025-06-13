import Moveable from 'moveable';
import { MOVEABLE_CONFIG } from './config';
import { generateInlineStyles } from './generateInlineStyles';
import { createDomTree, postMessageToParent } from './helpers';
import { changeTarget, state, updateElement } from './model';
import { insertDragButton, insertElement, positionDragButton, renderElementsToIframe, updateTargetStyle } from './view';

const NOT_MOVEABLE_ELEMENTS = new Set(['SECTION', 'LI']);
const FOCUSABLE_ELEMENTS = new Set(['LI', 'SPAN', 'P', 'A', 'BUTTON', 'INPUT']);

const controlUpdateElement = (updates) => {
  updateElement(updates, generateInlineStyles(updates));
  state.moveable.updateTarget();
  positionDragButton(state.currentTarget.clientHeight);
};

const controlReceivedElements = (elements) => {
  renderElementsToIframe(elements);
  initializeMoveable();
  state.currentTarget = document.querySelector('section');
};

const controlInsertElement = (newElement) => {
  const element = createDomTree(newElement);

  if (state.currentTarget.tagName === 'IMG') {
    insertElement(element, state.currentTarget.closest('section'));
  } else {
    insertElement(element, state.currentTarget);
  }

  if (newElement.name !== 'item') {
    positionDragButton(element.clientHeight);
  }

  state.moveable.elementGuidelines = [...state.moveable.elementGuidelines, element];
};

const controlDocumentClick = (event) => {
  const target = event.target.closest('.target');

  if (!target) return;

  event.stopPropagation();
  changeTarget(target);
  postMessageToParent('ELEMENT_CLICKED', { id: target.id });

  if (!NOT_MOVEABLE_ELEMENTS.has(target.tagName)) {
    state.moveable.target = target;
  }

  if (FOCUSABLE_ELEMENTS.has(target.tagName)) {
    target.focus();
  }
};

const controlIframeMessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'RECEIVE_ELEMENTS': {
      controlReceivedElements(payload.elements);
      break;
    }
    case 'UPDATE_ELEMENT': {
      controlUpdateElement(payload.updates);
      break;
    }
    case 'INSERT_ELEMENT': {
      controlInsertElement(payload.newElement);
      break;
    }
    case 'SELECTION_CHANGED': {
      document.querySelector(`#${payload}`)?.click();
      positionDragButton(state.currentTarget.clientHeight);
      break;
    }
  }
};

const controlDrag = ({ target, left, top }) => {
  if (target.id.includes('item')) return;

  updateTargetStyle([
    ['left', `${left}px`],
    ['top', `${top}px`]
  ]);

  postMessageToParent('UPDATE_POSITION', { id: target.id, left, top });
};

const controlResize = ({ target, width, height }) => {
  if (target.id.includes('item')) return;

  const w = `${width}px`;
  const h = `${height}px`;

  if (target.tagName === 'UL') {
    updateTargetStyle([
      ['minWidth', w],
      ['minHeight', h]
    ]);
  } else {
    updateTargetStyle([
      ['width', w],
      ['height', h]
    ]);
  }

  positionDragButton(height);
  postMessageToParent('UPDATE_SIZE', { id: target.id, width, height });
};

const controlRotate = ({ target, transform }) => {
  if (target.id.includes('item')) return;

  updateTargetStyle([['transform', transform]]);
  postMessageToParent('UPDATE_TRANSFORM', { id: target.id, transform });
};

const controlScale = ({ target, transform }) => {
  updateTargetStyle([['transform', transform]]);
  postMessageToParent('UPDATE_TRANSFORM', { id: target.id, transform });
};

function initializeMoveable() {
  const container = document.body;
  const targets = document.querySelectorAll('.target');

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  state.moveable = new Moveable(container, {
    ...MOVEABLE_CONFIG,
    elementGuidelines: Array.from(targets),
    verticalGuidelines: [0, containerWidth / 2, containerWidth],
    horizontalGuidelines: [0, containerHeight / 2, containerHeight]
  });

  state.moveable
    .on('drag', controlDrag)
    .on('resize', controlResize)
    .on('rotate', controlRotate)
    .on('scale', controlScale);
}

const controlDOMContentLoaded = () => {
  postMessageToParent('IFRAME_READY');

  setTimeout(() => {
    insertDragButton();
    state.moveable.dragTarget = document.querySelector('#dragTargetButton');
  }, 100);
};

document.addEventListener('click', controlDocumentClick);
window.addEventListener('message', controlIframeMessage);
window.addEventListener('DOMContentLoaded', controlDOMContentLoaded);
