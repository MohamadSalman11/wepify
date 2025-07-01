import type { MessageFromIframeData } from '@shared/types';

export function postMessage(message: MessageFromIframeData) {
  window.parent.postMessage(message, '*');
}
