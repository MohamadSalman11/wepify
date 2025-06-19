import type { RefObject } from 'react';

const editable = (el: Element | null | undefined) =>
  !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable);

export const isTyping = (iframeRef: RefObject<HTMLIFrameElement | null>): boolean => {
  const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
  const activeMain = document.activeElement;
  const activeIframe = doc?.activeElement;

  return editable(activeMain) || editable(activeIframe);
};
