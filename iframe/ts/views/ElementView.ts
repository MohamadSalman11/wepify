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
  private domEl!: HTMLElement;
  private rootEl: HTMLDivElement | null = document.querySelector(SELECTOR_ROOT);

  render = (domEl: HTMLElement, parentId?: string) => {
    this.domEl = domEl;

    if (domEl.tagName === TAG_SECTION) {
      this.rootEl?.append(domEl);
      return;
    }

    const parent = (parentId && document.querySelector(`#${parentId}`)) || this.rootEl;
    if (!parent) return;

    parent.append(domEl);
  };

  adjustGridColumns(newColumns: number, size: number | 'auto') {
    this.domEl.style.gridTemplateColumns = `repeat(${newColumns}, ${size === 'auto' ? '1fr' : `${size}px`})`;
  }

  applyStyles(styles: Partial<CSSStyleDeclaration>) {
    Object.assign(this.domEl.style, styles);
  }

  updateAttributes(updates: PageElementAttrs) {
    const { href, type, placeholder } = updates;

    if (href !== undefined && this.domEl instanceof HTMLAnchorElement) this.domEl.href = href;
    if (type && this.domEl instanceof HTMLInputElement) this.domEl.type = type;
    if (placeholder && this.domEl instanceof HTMLInputElement) this.domEl.placeholder = placeholder;
  }

  click(el: HTMLElement) {
    this.set(el);
    el.click();
  }

  focus(el: HTMLElement) {
    el.focus();
  }

  set(el: HTMLElement) {
    this.domEl = el;
  }

  scrollIntoView(block: 'start' | 'center' = 'center') {
    this.domEl.scrollIntoView({ block });
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
