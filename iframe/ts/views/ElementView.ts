import { PageElementAttrs } from '@shared/typing';
import { SELECTOR_ROOT, SELECTOR_SECTION } from '../constants';

/**
 * Constants
 */

const SELECTOR_SELECTED_ITEM = '[data-selected-item]';
const SELECTOR_SELECTED_SECTION = '[data-selected-section]';
const SELECTOR_ITEM = '[data-name="item"]';
const ATTR_SELECTED_SECTION = 'data-selected-section';
const ATTR_SELECTED_ITEM = 'data-selected-item';
const TAG_SECTION = 'SECTION';

/**
 * Class definition
 */

class ElementView {
  domElement!: HTMLElement;

  render = (domElement: HTMLElement, parentId?: string) => {
    const rootElement = document.querySelector(SELECTOR_ROOT);

    this.domElement = domElement;

    if (domElement.tagName === TAG_SECTION) {
      rootElement?.append(domElement);
      return;
    }

    const parent = (parentId && document.querySelector(`#${parentId}`)) || rootElement;
    if (!parent) return;

    parent.append(domElement);
  };

  adjustGridColumns(newColumns: number, size: number | 'auto') {
    this.domElement.style.gridTemplateColumns = `repeat(${newColumns}, ${size === 'auto' ? '1fr' : `${size}px`})`;
  }

  applyStyles(styles: Partial<CSSStyleDeclaration>) {
    Object.assign(this.domElement.style, styles);
  }

  updateAttributes(updates: PageElementAttrs) {
    const { href, type, placeholder } = updates;

    if (href !== undefined && this.domElement instanceof HTMLAnchorElement) this.domElement.href = href;
    if (type && this.domElement instanceof HTMLInputElement) this.domElement.type = type;
    if (placeholder && this.domElement instanceof HTMLInputElement) this.domElement.placeholder = placeholder;
  }

  click(el: HTMLElement) {
    this.set(el);
    el.click();
  }

  focus(el: HTMLElement) {
    el.focus();
  }

  set(el: HTMLElement) {
    this.domElement = el;
  }

  scrollIntoView(block: 'start' | 'center' = 'center') {
    this.domElement.scrollIntoView({ block });
  }

  updateSelection(newTarget: HTMLElement) {
    const selectedItem = document.querySelector(SELECTOR_SELECTED_ITEM);
    const selectedSection = document.querySelector(SELECTOR_SELECTED_SECTION);

    selectedItem?.removeAttribute(ATTR_SELECTED_ITEM);
    selectedSection?.removeAttribute(ATTR_SELECTED_SECTION);

    newTarget.closest(SELECTOR_ITEM)?.setAttribute(ATTR_SELECTED_ITEM, '');
    newTarget.closest(SELECTOR_SECTION)?.setAttribute(ATTR_SELECTED_SECTION, '');
  }
}

export default new ElementView();
