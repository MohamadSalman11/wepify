import JSZip from 'jszip';
import Moveable from 'moveable';
import cssFile from '../style.css?raw';
import { MOVEABLE_CONFIG } from './config';
import { generateInlineStyles } from './generateInlineStyles';
import { createDomTree, postMessageToParent } from './helpers';
import { cleanUpHTML, minifyHTML } from './minifyHTML';
import { changeTarget, state, updateElement } from './model';
import { insertDragButton, insertElement, positionDragButton, renderElements, updateTargetStyle } from './view';
const NOT_MOVEABLE_ELEMENTS = new Set(['SECTION', 'LI']);
const FOCUSABLE_ELEMENTS = new Set(['LI', 'SPAN', 'P', 'A', 'BUTTON', 'INPUT']);

async function controlDownloadZip(site, shouldMinify) {
  const zip = new JSZip();

  zip.file('style.css', cssFile);

  delete site.id;

  for (const page of site.pages) {
    const doc = document.implementation.createHTMLDocument(page.name);

    doc.head.innerHTML = document.head.innerHTML;
    doc.title = page.title || page.name;

    delete page.id;

    renderElements(page.elements, doc);

    const htmlString = doc.documentElement.outerHTML;

    const html = shouldMinify ? await minifyHTML(htmlString) : await cleanUpHTML(htmlString);
    const fileName = page.isIndex ? 'index.html' : `${page.name.toLowerCase().split(' ').join('_')}.html`;

    zip.file(fileName, html);
  }

  const siteJsonStr = JSON.stringify(site, null, 2);
  zip.file('site.json', siteJsonStr);

  const content = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'website.zip';
  a.click();
  URL.revokeObjectURL(url);
}

const controlUpdateElement = (updates) => {
  updateElement(updates, generateInlineStyles(updates));
  state.moveable.updateTarget();
  positionDragButton(state.currentTarget.clientHeight);
};

const controlReceivedElements = (elements) => {
  renderElements(elements);

  const isPreview = document.querySelector('body').dataset.isPreview;
  state.isSitePreviewMode = !isPreview || isPreview === 'false' ? false : true;

  if (state.isSitePreviewMode) {
    return;
  }

  initializeMoveable();
  insertDragButton();
  state.currentTarget = document.querySelector('section');
  state.moveable.dragTarget = document.querySelector('#dragTargetButton');
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

const controlSelectionChanged = (id) => {
  const el = document.querySelector(`#${id}`);
  if (el) {
    el.scrollIntoView({ block: 'center' });
    el.click();
    positionDragButton(state.currentTarget?.clientHeight);
  }
};

const controlDocumentClick = (event) => {
  const target = event.target.closest('.target');

  if (!target || state.isSitePreviewMode) return;

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
    case 'DELETE_ELEMENT': {
      document.querySelector(`#${payload.id}`).remove();
      break;
    }
    case 'SELECTION_CHANGED': {
      controlSelectionChanged(payload);
      break;
    }

    case 'DOWNLOAD_SITE': {
      controlDownloadZip(payload.site, payload.shouldMinify);
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
};

document.addEventListener('click', controlDocumentClick);
window.addEventListener('message', controlIframeMessage);
window.addEventListener('DOMContentLoaded', controlDOMContentLoaded);
