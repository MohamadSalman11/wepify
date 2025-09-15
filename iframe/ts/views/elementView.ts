import { PageElementAttrs } from '@shared/typing';
import { SELECTOR_ROOT, SELECTOR_SECTION } from '../constants';

/**
 * Constants
 */

const SELECTOR_HOVER_BOX = '.hover-box';
const SELECTOR_SELECTED_ITEM = '[data-selected-item]';
const SELECTOR_SELECTED_SECTION = '[data-selected-section]';
const SELECTOR_ITEM = '[data-name="gridItem"], [data-name="listItem"]';
const CLASS_ELEMENT_HOVERED = 'element-hovered';

const TAG_SECTION = 'SECTION';
const ATTR_SELECTED_SECTION = 'data-selected-section';
const ATTR_SELECTED_ITEM = 'data-selected-item';

/**
 * Class definition
 */

class ElementView {
  private domEl!: HTMLElement;
  private rootEl: HTMLDivElement | null = document.querySelector(SELECTOR_ROOT);

  render = (domEl: HTMLElement, parentId?: string | null) => {
    this.domEl = domEl;

    if (!parentId || domEl.tagName === TAG_SECTION) {
      this.rootEl?.append(domEl);
      return;
    }

    const parent = (parentId && document.querySelector(`#${parentId}`)) || this.rootEl;

    parent?.append(domEl);
  };

  showHover(el: HTMLElement) {
    const elName = el.dataset.name;

    this.hideHover();

    el.classList.add(CLASS_ELEMENT_HOVERED);

    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const borderRadius = Number.parseFloat(style.borderRadius || '0');

    let offset = 0.5;

    if (borderRadius > 0) {
      offset = 5;
    }

    const width = rect.width + offset * 2;
    const height = rect.height + offset * 2;
    const top = rect.top + window.scrollY - offset;
    const left = rect.left + window.scrollX - offset;

    document.body.insertAdjacentHTML('beforeend', this.generateHoverBoxMarkup(elName || '', width, height, top, left));
  }

  hideHover() {
    const el = document.querySelector(`.${CLASS_ELEMENT_HOVERED}`);

    if (el) {
      el.classList.remove(CLASS_ELEMENT_HOVERED);
      const hoverBox = document.querySelector(SELECTOR_HOVER_BOX);
      hoverBox?.remove();
    }
  }

  updateAttributes(updates: PageElementAttrs) {
    const { href, type, placeholder } = updates;

    if (href !== undefined && this.domEl instanceof HTMLAnchorElement) this.domEl.href = href;
    if (type && this.domEl instanceof HTMLInputElement) this.domEl.type = type;
    if (placeholder !== undefined && this.domEl instanceof HTMLInputElement) this.domEl.placeholder = placeholder;
  }

  updateSelection(newTarget: HTMLElement) {
    const selectedItem = document.querySelector(SELECTOR_SELECTED_ITEM);
    const selectedSection = document.querySelector(SELECTOR_SELECTED_SECTION);
    const hoverBox = document.querySelector(SELECTOR_HOVER_BOX) as HTMLDivElement;

    if (hoverBox) {
      hoverBox.style.display = 'none';
    }

    selectedItem?.removeAttribute(ATTR_SELECTED_ITEM);
    selectedSection?.removeAttribute(ATTR_SELECTED_SECTION);

    newTarget.closest(SELECTOR_ITEM)?.setAttribute(ATTR_SELECTED_ITEM, '');
    newTarget.closest(SELECTOR_SECTION)?.setAttribute(ATTR_SELECTED_SECTION, '');
  }

  adjustGridColumns(newColumns: number, size: number | 'auto') {
    this.domEl.style.gridTemplateColumns = `repeat(${newColumns}, ${size === 'auto' ? '1fr' : `${size}px`})`;
  }

  applyStyles(styles: Partial<CSSStyleDeclaration>) {
    Object.assign(this.domEl.style, styles);
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

  // private
  private generateHoverBoxMarkup(elName: string, width: number, height: number, top: number, left: number) {
    return `
    <div class="hover-box" style="
      width: ${width}px;
      height: ${height}px;
      top: ${top}px;
      left: ${left}px;
    ">
      <div class="hover-inner">
        <div class="hover-badge">${elName}</div>
      </div>
    </div>
  `;
  }
}

export default new ElementView();
