import { EditorToIframe, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import pageView from '../views/pageView';
import contextMenuController from './contextMenuController';
import elementController from './elementController';
import keyboardController from './keyboardController';
import moveableController from './moveableController';
import pageController from './pageController';

const controlDocumentClick = (event: globalThis.MouseEvent) => {
  contextMenuController.handleDocumentClick(event);
  elementController.handleDocumentClick(event);
};

const controlInputChange = (event: Event) => {
  elementController.handleInputChange(event);
};

const controlEditableButton = (e: KeyboardEvent) => {
  const active = document.activeElement as HTMLElement;
  const isEditableSpanInButton = active?.isContentEditable && active.closest('button');
  const isSpaceOrEnter = e.key === ' ' || e.key === 'Enter';

  if (isEditableSpanInButton && isSpaceOrEnter) {
    e.preventDefault();
    const insertText = e.key === ' ' ? ' ' : '\n';
    document.execCommand('insertText', false, insertText);
  }
};

const handleDomContentLoaded = () => {
  iframeConnection.send(IframeToEditor.IframeReady, {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  });
};

iframeConnection.on(EditorToIframe.RenderPage, (payload) => {
  pageController.render(payload);
});

iframeConnection.on(EditorToIframe.UpdatePage, (payload) => {
  pageController.update(payload);
});

iframeConnection.on(EditorToIframe.InsertElement, (payload) => {
  elementController.insert(payload);
});

iframeConnection.on(EditorToIframe.InsertElements, (payload) => {
  pageController.renderElements(payload);
});

iframeConnection.on(EditorToIframe.SelectElement, (payload) => {
  elementController.select(payload);
});

iframeConnection.on(EditorToIframe.UpdateElement, (payload) => {
  elementController.update(payload);
});

iframeConnection.on(EditorToIframe.DeviceChanged, (payload) => {
  if (payload.elements) {
    pageController.render(payload);
  } else {
    pageView.setDeviceSimulator(payload.deviceSimulator);
  }

  moveableController.clearTarget();
});

document.addEventListener('input', controlInputChange);
document.addEventListener('click', controlDocumentClick);
document.addEventListener('keydown', controlEditableButton);
document.addEventListener('contextmenu', contextMenuController.show.bind(contextMenuController));
document.addEventListener('keydown', keyboardController.handleKeydown);
document.addEventListener('DOMContentLoaded', handleDomContentLoaded);
document.addEventListener('touchstart', contextMenuController.handleTouchStart, { passive: false });
document.addEventListener('touchend', contextMenuController.handleTouchEnd);
