import { ElementsName, PAGE_PADDING, PAGE_PADDING_X, TAGS_WITHOUT_CHILDREN } from '@shared/constants';
import {
  DeviceType,
  MessageFromIframe,
  MessageToIframe,
  MessageToIframePayloadMap,
  Site,
  type PageElement
} from '@shared/typing';
import Moveable, { OnRotate, type OnDrag, type OnResize } from 'moveable';
import { createDomTree } from './compiler/dom/createDomTree';
import { domToPageElement } from './compiler/dom/domToPageElement';
import { generateInlineStyles } from './compiler/dom/generateInlineStyles';
import { MOVEABLE_CONFIG } from './config';
import { SELECTOR_DRAG_BUTTON, SELECTOR_ROOT, SELECTOR_TARGET } from './constants';
import { changeTarget, getMoveableInstance, getTarget, state } from './model';
import SiteExporter from './SiteExporter';
import { adjustGridColumnsIfNeeded } from './utils/adjustGridColumnsIfNeeded';
import { createNewElement } from './utils/createNewElement';
import { extractTransform } from './utils/extractTransform';
import { getScreenBreakpoint } from './utils/getScreenBreakpoint';
import { getVerticalBorderSum } from './utils/getVerticalBorderSum';
import { isDefined } from './utils/isDefined';
import { maybeWrapWithBreakpoint } from './utils/maybeWrapWithBreakpoint';
import { postMessageToApp } from './utils/postMessageToApp';
import { insertDragButton, insertElement, positionDragButton, renderElements, updateTargetStyle } from './view';

/**
 * Constants
 */

const SELECTOR_BODY = 'body';
const SELECTOR_SECTION = 'section';
const SELECTOR_CLOSEST_SECTION = "[id^='section-']";
const SELECTOR_ACTIVE_ITEM = '[class*="select-item"]';
const SELECTOR_ACTIVE_SECTION = '[class*="select-section"]';
const ID_FIRST_SECTION = 'section-1';
const SELECTOR_FIRST_SECTION = `#${ID_FIRST_SECTION}`;
const SELECTOR_CONTEXT_MENU = '#context-menu';
const CLASS_SELECTED_ITEM = 'select-item';
const CLASS_SELECTED_SECTION = 'select-section';
const NOT_MOVEABLE_ELEMENTS = new Set(['section', 'item']);
const FOCUSABLE_ELEMENTS = new Set(['LI', 'SPAN', 'P', 'A', 'BUTTON', 'INPUT']);

const CSS_FILE_MOVEABLE = 'moveable.css';
const LONG_PRESS_DURATION = 500;

enum ContextMenuActions {
  Copy = 'copy',
  Paste = 'paste',
  BringToFront = 'bring-to-front',
  SendToBack = 'send-to-back',
  Delete = 'delete'
}

enum KeyboardKeys {
  F12 = 'F12',
  I = 'I',
  C = 'c',
  V = 'v'
}

const iframeMessageHandlers: {
  [K in MessageToIframe]: (payload: MessageToIframePayloadMap[K]) => void;
} = {
  [MessageToIframe.RenderElements]: (payload) =>
    controlRenderElements(
      payload.elements,
      payload.isPreview,
      payload.deviceType,
      payload.scaleFactor,
      payload.backgroundColor
    ),
  [MessageToIframe.UpdateElement]: (payload) => controlUpdateElement(payload.updates),
  [MessageToIframe.UpdatePage]: (payload) => controlUpdatePage(payload.updates),
  [MessageToIframe.InsertElement]: (payload) =>
    controlInsertElement({ name: payload.name, additionalProps: payload.additionalProps }),
  [MessageToIframe.DeleteElement]: () => controlDeleteElement(),
  [MessageToIframe.ChangeSelection]: (payload) => controlSelectionChanged(payload),
  [MessageToIframe.SearchElement]: (payload) => controlSearchElement(payload),
  [MessageToIframe.DownloadSite]: (payload) => controlDownloadZip(payload.site, payload.shouldMinify)
};

/**
 * Controller functions
 */

const controlRenderElements = (
  elements: PageElement[],
  isPreview: boolean,
  deviceType: DeviceType,
  scaleFactor: number,
  backgroundColor: string
) => {
  state.isSitePreviewMode = isPreview;
  state.deviceType = deviceType;
  state.scaleFactor = scaleFactor;

  renderElements(elements);

  if (state.initRender) {
    controlUpdatePage({ backgroundColor });
  }

  const linkHref = `./${CSS_FILE_MOVEABLE}`;
  const existingLink = document.querySelector(`link[href="${linkHref}"]`);

  if (isPreview) {
    existingLink?.remove();
  } else if (!existingLink) {
    const link = document.createElement(ElementsName.Link);
    link.rel = 'stylesheet';
    link.href = linkHref;
    document.head.append(link);
  }

  if (state.moveable) {
    state.moveable.target = null;
  }

  if (state.isSitePreviewMode) return;

  const target = document.querySelector(SELECTOR_SECTION);

  if (!target) return;

  target.classList.add(CLASS_SELECTED_SECTION);
  target.click();
  changeTarget(target, ElementsName.Section);

  if (state.initRender) {
    initializeMoveable();
    insertDragButton();
    state.initRender = false;
  } else {
    maybeSetMoveableGuidelines();
  }

  getMoveableInstance().dragTarget = document.querySelector(SELECTOR_DRAG_BUTTON) as SVGAElement;
};

const controlUpdateElement = (updates: Partial<PageElement>) => {
  if (Object.keys(updates).length === 0) return;

  const target = getTarget();
  const section = target.closest(SELECTOR_CLOSEST_SECTION) as HTMLElement;
  const { link, type, placeholder } = updates as Record<string, any>;

  const styles = generateInlineStyles({
    element: maybeWrapWithBreakpoint(updates),
    isResponsive: true
  });

  if (link && target instanceof HTMLAnchorElement) target.href = link;
  if (type && target instanceof HTMLInputElement) target.type = type;
  if (placeholder && target instanceof HTMLInputElement) target.placeholder = placeholder;

  Object.assign(target.style, styles);

  getMoveableInstance().updateRect();
  positionDragButton(target.clientHeight, state.scaleFactor, getVerticalBorderSum(target));

  postMessageToApp({
    type: MessageFromIframe.ElementUpdated,
    payload: {
      id: target.id,
      fields: maybeWrapWithBreakpoint(updates)
    }
  });

  if (updates.fontFamily && section) {
    changeTarget(section, ElementsName.Section);
  }
};

const controlUpdatePage = (updates: { backgroundColor: string }) => {
  const body = document.querySelector('body');

  if (!body) {
    return;
  }

  Object.assign(body.style, updates);

  postMessageToApp({ type: MessageFromIframe.PageUpdated, payload: { updates } });
};

const controlInsertElement = ({
  name,
  additionalProps,
  elNode
}: {
  name?: string;
  additionalProps?: Record<string, any>;
  elNode?: HTMLElement;
}) => {
  const target = getTarget();
  const moveableInstance = getMoveableInstance();
  const newElement = elNode ? domToPageElement(elNode) : createNewElement(name as string, additionalProps);
  const elementNode = elNode || createDomTree(newElement as PageElement);
  const canHaveNotChildren = TAGS_WITHOUT_CHILDREN.has(target.tagName.toLowerCase());

  if (canHaveNotChildren) {
    insertElement(elementNode, target.parentElement);
  } else {
    insertElement(elementNode, target);
  }

  if (state.targetName === ElementsName.Grid) {
    adjustGridColumnsIfNeeded(target);
  }

  if (newElement.name !== ElementsName.Item && newElement.name !== ElementsName.Image) {
    positionDragButton(elementNode.clientHeight, state.scaleFactor);
  }

  postMessageToApp({
    type: MessageFromIframe.ElementInserted,
    payload: {
      parentId: canHaveNotChildren
        ? (target.parentElement || target.closest(SELECTOR_CLOSEST_SECTION) || { id: SELECTOR_FIRST_SECTION }).id
        : target.id,
      element: newElement as PageElement
    }
  });

  elementNode.click();
  moveableInstance.elementGuidelines = [...(moveableInstance.elementGuidelines ?? []), elementNode];
};

const controlDeleteElement = () => {
  const target = getTarget();
  const targetId = target.id;
  const parentId = target.parentElement?.id;
  const section = document.querySelector(SELECTOR_CLOSEST_SECTION) as HTMLElementTagNameMap['section'];

  if (!section || !parentId || !targetId || target.id === ID_FIRST_SECTION) return;

  target.remove();
  section.click();

  postMessageToApp({
    type: MessageFromIframe.ElementDeleted,
    payload: { targetId, parentId }
  });
};

const controlSelectionChanged = (id: string) => {
  const elementNode = document.querySelector(`#${id}`) as HTMLElement;

  if (elementNode) {
    elementNode.scrollIntoView({ block: 'start' });
    elementNode.click();
    positionDragButton(elementNode.clientHeight, state.scaleFactor, getVerticalBorderSum(elementNode));
    postMessageToApp({
      type: MessageFromIframe.SelectionChanged,
      payload: domToPageElement(elementNode) as PageElement
    });
  }
};

const controlSearchElement = (id: string) => {
  const element = document.querySelector(`#${id}`) as HTMLElement;

  if (!element) return;

  element.click();

  postMessageToApp({
    type: MessageFromIframe.SelectionChanged,
    payload: domToPageElement(element) as PageElement
  });
};

export const controlDownloadZip = async (site: Site, shouldMinify: boolean) => {
  const exporter = new SiteExporter(shouldMinify);
  await exporter.exportSite(site);

  postMessageToApp({ type: MessageFromIframe.SiteDownloaded });
};

const controlContextMenuActions = (event: globalThis.MouseEvent) => {
  const action = (event.target as HTMLElement).closest('li')?.dataset.action;
  const target = getTarget();

  if (action === ContextMenuActions.Copy) {
    handleElementCopy(target.id);
  }

  if (action === ContextMenuActions.Paste) {
    handleElementPaste();
  }

  if (action === ContextMenuActions.BringToFront || action === ContextMenuActions.SendToBack) {
    handleBringToFrontOrSendToBack(target, action);
  }

  if (action === ContextMenuActions.Delete) {
    controlDeleteElement();
  }
};

const handleElementCopy = (targetId: string) => {
  state.lastCopiedElId = targetId;
};

const handleElementPaste = () => {
  const originalEl = document.querySelector(`#${state.lastCopiedElId}`) as HTMLElement;
  if (!originalEl) return;

  const clonedEl = originalEl.cloneNode(true) as HTMLElement;
  const obj: Record<string, number> = {};

  const updateIdsRecursively = (el: HTMLElement) => {
    const baseName = el.dataset.name;
    if (!baseName) return;

    obj[baseName] = (obj[baseName] ?? document.querySelectorAll(`[id^="${baseName}-"]`).length) + 1;

    const newId = `${baseName}-${obj[baseName]}`;
    el.id = newId;

    for (const child of el.children) {
      updateIdsRecursively(child as HTMLElement);
    }
  };

  updateIdsRecursively(clonedEl);
  controlInsertElement({ elNode: clonedEl });
};

const handleBringToFrontOrSendToBack = (target: HTMLElement, action: string) => {
  const parentEl = target.parentElement;
  if (!parentEl) return;

  let extremeZ = action === ContextMenuActions.BringToFront ? 0 : 0;

  for (const child of parentEl.children) {
    const z = Number.parseInt(globalThis.getComputedStyle(child).zIndex || '0', 10);
    if (!Number.isNaN(z)) {
      extremeZ = action === ContextMenuActions.BringToFront ? Math.max(extremeZ, z) : Math.min(extremeZ, z);
    }
  }

  const newZ = action === ContextMenuActions.BringToFront ? extremeZ + 1 : extremeZ - 1;
  controlUpdateElement({ zIndex: newZ });
};

const controlIframeMessage = (event: MessageEvent) => {
  const { type, payload } = event.data;
  const handler = iframeMessageHandlers[type as MessageToIframe];
  if (handler) handler(payload as never);
};

const controlDrag = (event: OnDrag) => {
  const { target, transform } = event;
  const { left, top } = extractTransform(transform) || {};

  updateTargetStyle([['transform', transform]]);

  if (!isDefined(left) || !isDefined(top)) return;

  postMessageToApp({
    type: MessageFromIframe.ElementUpdated,
    payload: { id: target.id, fields: maybeWrapWithBreakpoint({ left, top }) }
  });
};

const controlResize = (event: OnResize) => {
  const { target, width, height } = event;
  const w = target.clientWidth !== width;
  const h = target.clientHeight !== height;
  const sectionEl = document.querySelector(SELECTOR_ROOT);

  if (!sectionEl) return;

  if (w) updateTargetStyle([['width', `${width}px`]]);
  if (h) updateTargetStyle([['height', `${height}px`]]);
  if (h) positionDragButton(height, state.scaleFactor);

  const updates: any = {};
  if (w) updates.width = width === sectionEl.clientWidth - PAGE_PADDING_X ? 'fill' : width;
  if (h) updates.height = height === sectionEl.clientHeight - PAGE_PADDING ? 'fill' : height;

  positionDragButton(height, state.scaleFactor, getVerticalBorderSum(target as HTMLElement));

  if (!isDefined(w) || !isDefined(h)) return;

  postMessageToApp({
    type: MessageFromIframe.ElementUpdated,
    payload: { id: target.id, fields: maybeWrapWithBreakpoint(updates) }
  });
};

const controlRotate = (event: OnRotate) => {
  const { target, transform } = event;
  const { rotate } = extractTransform(transform) || {};

  updateTargetStyle([['transform', transform]]);

  if (!isDefined(rotate)) return;

  postMessageToApp({
    type: MessageFromIframe.ElementUpdated,
    payload: {
      id: target.id,
      fields: maybeWrapWithBreakpoint({ rotate })
    }
  });
};

const controlWindowResize = () => {
  const currentBreakpoint = getScreenBreakpoint();

  if (state.deviceType !== currentBreakpoint) {
    state.deviceType = getScreenBreakpoint();
    postMessageToApp({ type: MessageFromIframe.BreakpointChanged, payload: { newDeviceType: currentBreakpoint } });
  }
};

const controlContextMenu = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();

  const closestSection = (event.target as Element).closest(SELECTOR_CLOSEST_SECTION);
  const body = document.querySelector(SELECTOR_BODY);

  if (state.isSitePreviewMode || !body || !closestSection) return;

  let pageX = 0;
  let pageY = 0;
  const existingContextMenu = document.querySelector(SELECTOR_CONTEXT_MENU);

  existingContextMenu?.remove();

  if ('touches' in event && event.touches.length > 0) {
    pageX = event.touches[0].pageX;
    pageY = event.touches[0].pageY;
  } else if ('pageX' in event && 'pageY' in event) {
    pageX = event.pageX;
    pageY = event.pageY;
  }

  const contextMenuHTML = `
      <ul class="context-menu" id="context-menu" style="left:${pageX}px; top:${pageY}px;">
      <li data-action="copy">
        <img src="/clipboard-copy.svg" alt="Copy" />
        Copy
      </li>
      <li data-action="paste">
        <img src="/clipboard-paste.svg" alt="Paste" />
        Paste
      </li>
      <li data-action="bring-to-front">
        <img src="/bring-to-front.svg" alt="Bring to Front" />
        Bring to Front
      </li>
      <li data-action="send-to-back">
        <img src="/send-to-back.svg" alt="Send to Back" />
        Send to Back
      </li>
      <li data-action="delete">
        <img src="/trash.svg" alt="Delete" />
        Delete
      </li>
    </ul>
  `;

  body.insertAdjacentHTML('beforeend', contextMenuHTML);
};

const controlDOMContentLoaded = () => {
  postMessageToApp({ type: MessageFromIframe.IframeReady });
};

const controlDocumentClick = (event: globalThis.MouseEvent) => {
  const contextMenu = document.querySelector(SELECTOR_CONTEXT_MENU) as HTMLUListElement;

  if (contextMenu) {
    contextMenu.remove();
  }

  if ((event.target as HTMLElement)?.closest(SELECTOR_CONTEXT_MENU)) {
    controlContextMenuActions(event);
  }

  const target = (event.target as HTMLElement)?.closest(SELECTOR_TARGET) as HTMLElement;

  if (!target || state.isSitePreviewMode) return;

  const targetName = target.id.split('-')[0];

  event.stopPropagation();
  changeTarget(target, targetName);
  positionDragButton(target.clientHeight, state.scaleFactor, getVerticalBorderSum(target));
  postMessageToApp({ type: MessageFromIframe.SelectionChanged, payload: domToPageElement(target) as PageElement });

  if (!NOT_MOVEABLE_ELEMENTS.has(state.targetName || '')) {
    getMoveableInstance().target = target;
  }

  const previousSelected = document.querySelector(SELECTOR_ACTIVE_ITEM);
  previousSelected?.classList.remove(CLASS_SELECTED_ITEM);

  if (state.target && state.targetName === ElementsName.Item) {
    state.target.classList.add(CLASS_SELECTED_ITEM);
  }

  if (state.target && state.targetName === ElementsName.Section) {
    document.querySelector(SELECTOR_ACTIVE_SECTION)?.classList.remove(CLASS_SELECTED_SECTION);
    state.target.classList.add(CLASS_SELECTED_SECTION);
  }

  if (FOCUSABLE_ELEMENTS.has(target.tagName)) {
    target.focus();
  }
};

const maybeSetMoveableGuidelines = () => {
  if (!state.moveable) return;

  state.moveable.elementGuidelines = [...document.querySelectorAll(SELECTOR_TARGET)];
  state.moveable.horizontalGuidelines = [0, document.body.clientWidth / 2, document.body.clientWidth];
  state.moveable.verticalGuidelines = [0, document.body.clientHeight / 2, document.body.clientHeight];
};

const initializeMoveable = () => {
  const container = document.body;

  state.moveable = new Moveable(container, { ...MOVEABLE_CONFIG });

  maybeSetMoveableGuidelines();

  state.moveable.on('drag', controlDrag).on('resize', controlResize).on('rotate', controlRotate);
};

const controlKeydown = (event: KeyboardEvent) => {
  const key = event.key;
  const isF12 = key === KeyboardKeys.F12;
  const isCtrlShiftI = event.ctrlKey && event.shiftKey && key === KeyboardKeys.I;
  const isCmdOptI = event.metaKey && event.altKey && key === KeyboardKeys.I;
  const isDevToolsKey = isF12 || isCtrlShiftI || isCmdOptI;
  const isCopyShortcut = (event.ctrlKey || event.metaKey) && key.toLowerCase() === KeyboardKeys.C;
  const isPasteShortcut = (event.ctrlKey || event.metaKey) && key.toLowerCase() === KeyboardKeys.V;

  if (isDevToolsKey) {
    const sectionElement = document.querySelector(SELECTOR_CLOSEST_SECTION) as HTMLElement | null;
    sectionElement?.click();
    return;
  }

  if (isCopyShortcut) {
    event.preventDefault();
    const target = getTarget();

    if (target) {
      handleElementCopy(target.id);
    }

    return;
  }

  if (isPasteShortcut) {
    event.preventDefault();
    handleElementPaste();
  }
};

const controlTouchStart = (event: TouchEvent) => {
  state.longPressTimer = setTimeout(() => {
    event.preventDefault();
    controlContextMenu(event);
  }, LONG_PRESS_DURATION);
};

const controlTouchEnd = () => {
  if (state.longPressTimer) {
    clearTimeout(state.longPressTimer);
    state.longPressTimer = null;
  }
};

document.addEventListener('click', controlDocumentClick);
window.addEventListener('message', controlIframeMessage);
window.addEventListener('resize', controlWindowResize);
globalThis.addEventListener('contextmenu', controlContextMenu);
document.addEventListener('keydown', controlKeydown);
document.addEventListener('DOMContentLoaded', controlDOMContentLoaded);
document.addEventListener('touchstart', controlTouchStart, { passive: false });
document.addEventListener('touchend', controlTouchEnd);
