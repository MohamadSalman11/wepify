import { ElementNames, Tags, TAGS_WITHOUT_CHILDREN } from '@shared/constants';
import { MessageFromIframe, MessageToIframe, type PageElement, type Site } from '@shared/types';
import JSZip from 'jszip';
import Moveable, { type OnDrag, type OnResize } from 'moveable';
import cssFile from '../style.css?raw';
import { createDomTree } from './compiler/dom/createDomTree';
import { domToPageElement } from './compiler/dom/domToPageElement';
import { generateInlineStyles } from './compiler/dom/generateInlineStyles';
import { minifyCSS } from './compiler/minifyCSS';
import { cleanUpHTML, minifyHTML } from './compiler/minifyHTML';
import { MOVEABLE_CONFIG } from './config';
import { SELECTOR_TARGET } from './constants';
import { changeTarget, getMoveableInstance, getTarget, state, updateElement } from './model';
import { adjustGridColumnsIfNeeded } from './utils/adjustGridColumnsIfNeeded';
import { createNewElement } from './utils/createNewElement';
import { downloadBlob } from './utils/downloadBlob';
import { postMessage } from './utils/postMessage';
import {
  insertDragButton,
  insertElement,
  positionDragButton,
  renderElements,
  SELECTION_DRAG_BUTTON,
  updateTargetStyle
} from './view';

const SELECTOR_SECTION = 'section';
const SELECTOR_CLOSEST_SECTION = "[id^='section-']";
const SELECTOR_ACTIVE_ITEM = '[class*="select-item"]';
const SELECTOR_FIRST_SECTION = '#section-1';
const CLASS_SELECTED_ITEM = 'select-item';
const NOT_MOVEABLE_ELEMENTS = new Set(['section', 'item']);
const FOCUSABLE_ELEMENTS = new Set(['LI', 'SPAN', 'P', 'A', 'BUTTON', 'INPUT']);
const SITE_JSON_WARNING = `⚠️ Do NOT modify any fields in this file manually, it will break the application. Upload it and edit in the app`;

enum FileNames {
  IndexPage = 'index.html',
  StyleCSS = 'style.css',
  SiteJson = 'site.json',
  ZipDownload = 'website.zip'
}

const iframeMessageHandlers: Record<MessageToIframe, (payload: any) => void> = {
  [MessageToIframe.ReceiveElements]: (payload) => controlReceivedElements(payload.elements, payload.isPreview),
  [MessageToIframe.UpdateElement]: (payload) => controlUpdateElement(payload.updates),
  [MessageToIframe.InsertElement]: (payload) => controlInsertElement(payload.name, payload.additionalProps),
  [MessageToIframe.DeleteElement]: () => controlDeleteElement(),
  [MessageToIframe.SelectionChanged]: (payload) => controlSelectionChanged(payload),
  [MessageToIframe.SearchElement]: (payload) => controlSearchElement(payload),
  [MessageToIframe.DownloadSite]: (payload) => controlDownloadZip(payload.site, payload.shouldMinify)
};

async function controlDownloadZip(site: Site, shouldMinify: boolean) {
  const zip = new JSZip();

  zip.file(FileNames.StyleCSS, shouldMinify ? minifyCSS(cssFile) : cssFile);

  for (const page of site.pages) {
    const doc = document.implementation.createHTMLDocument(page.name);

    doc.head.innerHTML = document.head.innerHTML;
    doc.title = page.title || page.name;

    renderElements(page.elements, doc);

    const htmlString = doc.documentElement.outerHTML;
    const html = shouldMinify ? await minifyHTML(htmlString) : await cleanUpHTML(htmlString);
    const fileName = page.isIndex ? FileNames.IndexPage : `${page.name.toLowerCase().split(' ').join('_')}.html`;

    zip.file(fileName, html);
  }

  zip.file(FileNames.SiteJson, JSON.stringify({ __WARNING__: SITE_JSON_WARNING, ...site }, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });

  downloadBlob(content, FileNames.ZipDownload);
}

const controlUpdateElement = (updates: Partial<PageElement>) => {
  if (Object.keys(updates).length === 0) return;
  const target = getTarget();

  updateElement(updates, generateInlineStyles(updates));
  getMoveableInstance().updateRect();
  positionDragButton(getTarget().clientHeight);

  postMessage({ type: MessageFromIframe.UpdateElement, payload: { id: target.id, fields: updates } });
};

const controlReceivedElements = (elements: PageElement[], isPreview: boolean) => {
  renderElements(elements);

  state.isSitePreviewMode = isPreview;

  if (state.moveable) {
    state.moveable.target = null;
  }

  if (state.isSitePreviewMode) return;

  if (!state.moveable) {
    state.target = document.querySelector(SELECTOR_SECTION);
    state.targetName = ElementNames.Section;
    initializeMoveable();
    insertDragButton();
    getMoveableInstance().dragTarget = document.querySelector(SELECTION_DRAG_BUTTON) as SVGAElement;
  }
};

const controlInsertElement = (name: string, additionalProps?: Record<string, any>) => {
  const newElement = createNewElement(name, additionalProps);
  const elementNode = createDomTree(newElement);
  const target = getTarget();
  const moveableInstance = getMoveableInstance();
  const canHaveNotChildren = TAGS_WITHOUT_CHILDREN.has(target.tagName.toLowerCase());

  if (canHaveNotChildren) {
    insertElement(elementNode, target.parentElement);
  } else {
    insertElement(elementNode, target);
  }

  if (state.targetName === ElementNames.Grid) {
    adjustGridColumnsIfNeeded(target);
  }

  if (newElement.name !== ElementNames.Item && newElement.name !== ElementNames.Image) {
    positionDragButton(elementNode.clientHeight);
  }

  postMessage({
    type: MessageFromIframe.InsertElement,
    payload: {
      parentId: canHaveNotChildren
        ? (target.parentElement || target.closest(SELECTOR_CLOSEST_SECTION) || { id: SELECTOR_FIRST_SECTION }).id
        : target.id,
      element: newElement
    }
  });

  elementNode.click();
  moveableInstance.elementGuidelines = [...(moveableInstance.elementGuidelines ?? []), elementNode];
};

const controlDeleteElement = () => {
  const section = document.querySelector(SELECTOR_CLOSEST_SECTION) as HTMLElementTagNameMap['section'];
  const parentId = state.target?.parentElement?.id;
  const targetId = state.target?.id;

  if (!section || !parentId || !targetId) return;

  state.target?.remove();
  section.click();

  postMessage({
    type: MessageFromIframe.ElementDeleted,
    payload: { targetId, parentId }
  });
};

const controlSelectionChanged = (id: string) => {
  const elementNode = document.querySelector(`#${id}`) as HTMLElement;

  if (elementNode) {
    elementNode.scrollIntoView({ block: 'center' });
    elementNode.click();
    positionDragButton(getTarget().clientHeight);
  }
};

const controlSearchElement = (id: string) => {
  const element = document.querySelector(`#${id}`) as HTMLElement;

  if (!element) return;

  element.click();

  postMessage({
    type: MessageFromIframe.SelectionChanged,
    payload: domToPageElement(element)
  });
};

const controlDocumentClick = (event: MouseEvent) => {
  const target = (event.target as HTMLElement)?.closest(SELECTOR_TARGET) as HTMLElement;

  if (!target || state.isSitePreviewMode) return;

  event.stopPropagation();
  changeTarget(target, target.id.split('-')[0]);
  positionDragButton(target.clientHeight);
  postMessage({ type: MessageFromIframe.SelectionChanged, payload: domToPageElement(target) });

  if (!NOT_MOVEABLE_ELEMENTS.has(state.targetName || '')) {
    getMoveableInstance().target = target;
  }

  const previousSelected = document.querySelector(SELECTOR_ACTIVE_ITEM);
  previousSelected?.classList.remove(CLASS_SELECTED_ITEM);

  if (state.targetName === ElementNames.Item && state.target) {
    state.target.classList.add(CLASS_SELECTED_ITEM);
  }

  if (FOCUSABLE_ELEMENTS.has(target.tagName)) {
    target.focus();
  }
};

const controlIframeMessage = (event: MessageEvent) => {
  const { type, payload } = event.data;
  const handler = iframeMessageHandlers[type as MessageToIframe];
  if (handler) handler(payload);
};

const controlDrag = (event: OnDrag) => {
  const { target, left, top } = event;

  updateTargetStyle([
    ['left', `${left}px`],
    ['top', `${top}px`]
  ]);

  postMessage({ type: MessageFromIframe.UpdateElement, payload: { id: target.id, fields: { left, top } } });
};

const controlResize = (event: OnResize) => {
  const { target, width, height } = event;

  const w = `${width}px`;
  const h = `${height}px`;

  if (target.tagName === Tags.Ul) {
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
  postMessage({ type: MessageFromIframe.UpdateElement, payload: { id: target.id, fields: { width, height } } });
};

function initializeMoveable() {
  const container = document.body;
  const targets = document.querySelectorAll(SELECTOR_TARGET);

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  state.moveable = new Moveable(container, {
    ...MOVEABLE_CONFIG,
    elementGuidelines: [...targets],
    verticalGuidelines: [0, containerWidth / 2, containerWidth],
    horizontalGuidelines: [0, containerHeight / 2, containerHeight]
  });

  state.moveable.on('drag', controlDrag).on('resize', controlResize);
}

const controlDOMContentLoaded = () => {
  postMessage({ type: MessageFromIframe.IframeReady });
};

document.addEventListener('click', controlDocumentClick);
window.addEventListener('message', controlIframeMessage);
document.addEventListener('DOMContentLoaded', controlDOMContentLoaded);
