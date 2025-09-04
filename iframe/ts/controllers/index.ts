import { EditorToIframe, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import contextMenuController from './contextMenuController';
import elementController from './elementController';
import keyboardController from './keyboardController';
import pageController from './pageController';

const controlDocumentClick = (event: globalThis.MouseEvent) => {
  contextMenuController.handleDocumentClick(event);
  elementController.handleDocumentClick(event);
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

iframeConnection.on(EditorToIframe.SelectElement, (payload) => {
  elementController.select(payload);
});

iframeConnection.on(EditorToIframe.UpdateElement, (payload) => {
  elementController.update(payload);
});

iframeConnection.on(EditorToIframe.DeviceChanged, (payload) => {
  pageController.render(payload);
});

document.addEventListener('click', controlDocumentClick);
document.addEventListener('contextmenu', contextMenuController.show.bind(contextMenuController));
document.addEventListener('keydown', keyboardController.handleKeydown);
document.addEventListener('DOMContentLoaded', handleDomContentLoaded);
document.addEventListener('touchstart', contextMenuController.handleTouchStart, { passive: false });
document.addEventListener('touchend', contextMenuController.handleTouchEnd);
