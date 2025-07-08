import type { MessageFromIframeData } from '@shared/types';

export function postMessageToApp(message: MessageFromIframeData) {
  window.parent.postMessage(message, '*');
}
