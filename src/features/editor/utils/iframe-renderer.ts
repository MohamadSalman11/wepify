import type { RefObject } from 'react';
import generateInlineStyles from '../../../utils/generate-inline-styles';

export const renderElementTree = (el: any, doc: Document): HTMLElement => {
  const elNode = doc.createElement(el.tag);

  elNode.classList.add('target');
  Object.assign(elNode.style, generateInlineStyles(el));

  if (el.id) elNode.id = el.id;
  if (el.content) elNode.innerHTML = el.content;

  if (Array.isArray(el.children)) {
    for (const child of el.children) {
      const childNode = renderElementTree(child, doc);
      elNode.append(childNode);
    }
  }

  return elNode;
};

export function renderElementsToIframe(elements: any[], iframeRef: RefObject<HTMLIFrameElement>) {
  const iframeDoc = iframeRef.current?.contentDocument;

  if (!iframeDoc) {
    return;
  }

  const root = iframeDoc.querySelector('#root');

  if (!root) {
    return;
  }

  root.innerHTML = '';

  for (const el of elements) {
    const node = renderElementTree(el, iframeDoc);
    root.append(node);
  }

  iframeRef.current?.contentWindow?.postMessage({ type: 'ELEMENTS_READY' }, '*');
}
