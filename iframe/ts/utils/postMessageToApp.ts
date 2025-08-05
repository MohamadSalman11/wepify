import { TARGET_ORIGIN } from '@shared/constants';
import type { MessageFromIframeData } from '@shared/typing';

export const postMessageToApp = (message: MessageFromIframeData) => {
  window.parent.postMessage(message, TARGET_ORIGIN);
};
