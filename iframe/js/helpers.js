import { generateInlineStyles } from './generateInlineStyles';

const EDITABLE_ELEMENTS = new Set(['li', 'span', 'p', 'a', 'button']);

const handleEditableElement = (elementNode) => {
  elementNode.contentEditable = true;
  elementNode.spellcheck = false;

  if (elementNode.tagName === 'SPAN') {
    elementNode.role = 'heading';
  }

  elementNode.addEventListener('input', (event) => {
    postMessageToParent('UPDATE_ITEM_CONTENT', {
      id: event.target.id,
      content: event.target.textContent.trim()
    });
  });

  elementNode.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      if (event.target.tagName === 'BUTTON') {
        document.execCommand('insertText', false, ' ');
      }
    }
  });
};

const handleInputElement = (elementNode, type, placeholder) => {
  elementNode.type = type;
  elementNode.placeholder = placeholder;
  elementNode.autocomplete = 'off';
};

export const createDomTree = (element) => {
  const { id, src, link, content, tag, type, placeholder, children } = element;
  const elementNode = document.createElement(tag);
  const isEditable = EDITABLE_ELEMENTS.has(tag);

  elementNode.classList.add('target');
  Object.assign(elementNode.style, generateInlineStyles(element));

  if (link) elementNode.href = link;
  if (id) elementNode.id = id;
  if (src) elementNode.src = src;
  if (content) elementNode.innerHTML = content;

  if (tag === 'input') {
    handleInputElement(elementNode, type, placeholder);
  }

  if (isEditable) {
    handleEditableElement(elementNode);
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      const childNode = createDomTree(child);
      elementNode.appendChild(childNode);
    });
  }

  return elementNode;
};

export const postMessageToParent = (type, payload) => {
  window.parent.postMessage({ type, payload }, '*');
};
