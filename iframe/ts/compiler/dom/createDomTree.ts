import { Tags } from '@shared/constants';
import { MessageFromIframe, type PageElement } from '@shared/types';
import { CONTENT_EDITABLE_ELEMENTS, SELECTOR_TARGET } from '../../constants';
import { postMessageToApp } from '../../utils/postMessageToApp';
import { positionDragButton } from '../../view';
import { generateInlineStyles } from './generateInlineStyles';

const DEFAULT_INPUT_AUTOCOMPLETE = 'off';
const HTML_ELEMENT_ROLE_HEADING = 'heading';

export const createDomTree = (element: PageElement) => {
  const { id, content, tag, children } = element;
  const elementNode = document.createElement(tag);
  const isEditable = CONTENT_EDITABLE_ELEMENTS.has(tag);
  const isLinkElement = 'link' in element && elementNode instanceof HTMLAnchorElement;
  const isImgElement = 'src' in element && elementNode instanceof HTMLImageElement;
  const isInputElement = 'type' in element && 'placeholder' in element && elementNode instanceof HTMLInputElement;

  elementNode.id = id;
  elementNode.classList.add(SELECTOR_TARGET.replace('.', ''));
  Object.assign(elementNode.style, generateInlineStyles(element));

  if (content) {
    elementNode.textContent = content;
  }

  if (isLinkElement && element.link) {
    elementNode.href = element.link;
  } else if (isImgElement) {
    elementNode.src = element.src || '';
    elementNode.addEventListener('load', () => positionDragButton(elementNode.clientHeight));
  } else if (isInputElement) {
    handleInputElement(elementNode, element.type as string, element.placeholder as string);
  }

  if (isEditable) {
    handleEditableElement(elementNode);
  }

  if (Array.isArray(children)) {
    for (const child of children) {
      const childNode = createDomTree(child);
      elementNode.append(childNode);
    }
  }

  return elementNode;
};

const handleInputElement = (elementNode: HTMLInputElement, type: string, placeholder: string) => {
  elementNode.type = type;
  elementNode.placeholder = placeholder;
  elementNode.autocomplete = DEFAULT_INPUT_AUTOCOMPLETE;
};

const handleEditableElement = (elementNode: HTMLElement) => {
  elementNode.contentEditable = 'true';
  elementNode.spellcheck = false;

  if (elementNode.tagName === Tags.Span) {
    elementNode.role = HTML_ELEMENT_ROLE_HEADING;
  }

  elementNode.addEventListener('input', (event: Event) => {
    const target = event.target as HTMLElement | null;

    if (!target) return;

    const { id, textContent } = target;

    if (!id) return;

    postMessageToApp({
      type: MessageFromIframe.UpdateElement,
      payload: { id, fields: { content: (textContent || '').trim() } }
    });
  });

  elementNode.addEventListener('keydown', (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;

    if (event.key === ' ' && target?.tagName === Tags.Button) {
      document.execCommand('insertText', false, ' ');
    }
  });
};
