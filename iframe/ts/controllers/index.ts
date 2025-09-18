import { EditorToIframe, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { state } from '../model';
import pageView from '../views/pageView';
import contextMenuController from './contextMenuController';
import elementController from './elementController';
import moveableController from './moveableController';
import pageController from './pageController';

const controlDocumentClick = (event: globalThis.MouseEvent) => {
  contextMenuController.handleDocumentClick(event);
  elementController.handleDocumentClick(event);
};

const controlDocumentMouseover = (event: MouseEvent) => {
  elementController.handleMouseover(event);
};

const controlDocumentMouseout = () => {
  elementController.handleMouseout();
};

const controlInputChange = (event: Event) => {
  elementController.handleInputChange(event);
};

const controlWindowResize = () => {
  moveableController.clearTarget();
  setTimeout(() => pageView.setDeviceSimulator(state.deviceSimulator));
};

const controlWindowLoad = () => {
  iframeConnection.send(IframeToEditor.IframeReady, {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  });
};

const controlEditableButton = (event: KeyboardEvent) => {
  const active = document.activeElement as HTMLElement;
  const isEditableSpanInButton = active?.isContentEditable && active.closest('button');
  const isSpaceOrEnter = event.key === ' ' || event.key === 'Enter';

  if (isEditableSpanInButton && isSpaceOrEnter) {
    event.preventDefault();
    const insertText = event.key === ' ' ? ' ' : '\n';
    document.execCommand('insertText', false, insertText);
  }
};

const controlPaste = (event: ClipboardEvent) => {
  const active = document.activeElement as HTMLElement;

  if (!active?.isContentEditable) {
    return;
  }

  event.preventDefault();
  const text = event.clipboardData?.getData('text/plain') ?? '';
  document.execCommand('insertText', false, text);
};

const controlUndoRedo = (event: KeyboardEvent) => {
  const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z';

  const isRedo =
    (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') ||
    (event.ctrlKey && event.key.toLowerCase() === 'y');

  if ((isUndo || isRedo) && !elementController.currentEl?.isContentEditable) {
    event.preventDefault();
  }
};

iframeConnection.on(EditorToIframe.RenderPage, (payload) => {
  pageController.render(payload);
});

iframeConnection.on(EditorToIframe.UpdatePage, (payload) => {
  pageController.update(payload);
});

iframeConnection.on(EditorToIframe.ZoomInPage, (payload) => {
  pageView.zoom(payload);
  moveableController.clearTarget();
});

iframeConnection.on(EditorToIframe.InsertElement, (payload) => {
  elementController.insert(payload);
});

iframeConnection.on(EditorToIframe.InsertCopiedElement, (payload) => {
  elementController.insertCopied(payload);
});

iframeConnection.on(EditorToIframe.ChangeElementPosition, (payload) => {
  elementController.changePosition(payload.elementId, payload.newIndex);
});

iframeConnection.on(EditorToIframe.SearchText, (payload) => {
  elementController.searchText(payload);
});

iframeConnection.on(EditorToIframe.SelectElement, (payload) => {
  elementController.select(payload);
});

iframeConnection.on(EditorToIframe.UpdateElement, (payload) => {
  elementController.update(payload);
});

iframeConnection.on(EditorToIframe.DeviceChanged, (payload) => {
  if (payload.elements) {
    pageController.render(payload, true);
  }

  state.deviceSimulator = payload.deviceSimulator;
  pageView.setDeviceSimulator(payload.deviceSimulator);
  moveableController.clearTarget();
});

document.addEventListener('paste', controlPaste);
window.addEventListener('resize', controlWindowResize);
window.addEventListener('load', controlWindowLoad);
document.addEventListener('keydown', controlUndoRedo);
document.addEventListener('input', controlInputChange);
document.addEventListener('click', controlDocumentClick);
document.addEventListener('mouseover', controlDocumentMouseover);
document.addEventListener('mouseout', controlDocumentMouseout);
document.addEventListener('keydown', controlEditableButton);
document.addEventListener('contextmenu', contextMenuController.show.bind(contextMenuController));
document.addEventListener('touchend', contextMenuController.handleTouchEnd);
document.addEventListener('touchstart', contextMenuController.handleTouchStart.bind(contextMenuController), {
  passive: false
});
