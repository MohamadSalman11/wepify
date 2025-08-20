import { Tags } from '@shared/constants';
import { MessageFromIframe, type PageElement } from '@shared/typing';
import { CONTENT_EDITABLE_ELEMENTS, SELECTOR_TARGET } from '../../constants';
import { state } from '../../model';
import { getVerticalBorderSum } from '../../utils/getVerticalBorderSum';
import { postMessageToApp } from '../../utils/postMessageToApp';
import { positionDragButton } from '../../view';
import { generateInlineStyles } from './generateInlineStyles';

const DEFAULT_INPUT_AUTOCOMPLETE = 'off';
const HTML_ELEMENT_ROLE_HEADING = 'heading';

export const createDomTree = (element: PageElement) => {
  const { id, content, tag, children, name, color, colorOnHover, backgroundColorOnHover, backgroundColor } = element;
  const elementNode = document.createElement(tag);
  const isEditable = CONTENT_EDITABLE_ELEMENTS.has(tag);
  const isLinkElement = 'link' in element && elementNode instanceof HTMLAnchorElement;
  const isImgElement = 'src' in element && elementNode instanceof HTMLImageElement;
  const isInputElement = 'type' in element && 'placeholder' in element && elementNode instanceof HTMLInputElement;
  const styles = generateInlineStyles({ element, isResponsive: true });

  elementNode.id = id;
  elementNode.dataset.name = name;
  elementNode.classList.add(SELECTOR_TARGET.replace('.', ''));
  Object.assign(elementNode.style, styles);

  if (content) elementNode.textContent = content;

  if (backgroundColor) {
    elementNode.dataset.originalBg = backgroundColor;
  }

  if (backgroundColorOnHover) {
    elementNode.dataset.backgroundColorOnHover = backgroundColorOnHover;

    elementNode.setAttribute('onmouseover', `this.style.backgroundColor='${backgroundColorOnHover}'`);
    elementNode.setAttribute('onmouseout', `this.style.backgroundColor='${backgroundColor}'`);
  }

  if (color) {
    elementNode.dataset.originalColor = color;
  }

  if (colorOnHover) {
    elementNode.dataset.colorOnHover = colorOnHover;

    elementNode.setAttribute('onmouseover', `this.style.color='${colorOnHover}'`);
    elementNode.setAttribute('onmouseout', `this.style.color='${color}'`);
  }

  if (isLinkElement && element.link) {
    elementNode.href = element.link;
    elementNode.target = '_blank';

    elementNode.addEventListener('click', (event) => {
      event.preventDefault();

      if (state.isSitePreviewMode) {
        postMessageToApp({ type: MessageFromIframe.NavigateToPage, payload: elementNode.getAttribute('href') || '' });
      }
    });
  } else if (isImgElement) {
    elementNode.src = element.src || '';
    elementNode.addEventListener('load', () => positionDragButton(elementNode.clientHeight));
  } else if (isInputElement) {
    handleInputElement(elementNode, element.type as string, element.placeholder as string);
  }

  if (isEditable && !state.isSitePreviewMode) {
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
  elementNode.spellcheck = false;

  if (elementNode.tagName === Tags.Span) {
    elementNode.role = HTML_ELEMENT_ROLE_HEADING;
  }

  elementNode.addEventListener('input', (event: Event) => {
    const target = event.target as HTMLElement | null;

    if (!target) return;

    const { id, textContent } = target;

    if (!id) return;

    state.moveable?.updateRect();

    positionDragButton(target.clientHeight, state.scaleFactor, getVerticalBorderSum(target));

    postMessageToApp({
      type: MessageFromIframe.ElementUpdated,
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
