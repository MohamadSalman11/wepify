import { DomCreator } from '@compiler/dom/DomCreator';
import { StyleGenerator } from '@compiler/style/StyleGenerator';
import { resolveStyleDependencies } from '@compiler/utils/resolveStyleDependencies';
import { ElementsName, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { PageElement, PageElementStyle } from '@shared/typing';
import { SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import { createNewElement } from '../utils/createNewElement';
import elementView from '../views/elementView';
import moveableController from './moveableController';

/**
 * Constants
 */

const ATTR_CONTENT_EDITABLE = 'contenteditable';
const CLASS_ELEMENT_HOVERED = 'element-hovered';

const DATASET_NOT_MOVEABLE = 'notMoveable';
const DATASET_FOCUSABLE = 'focusable';
const DATASET_CONTENT_EDITABLE = 'contentEditable';
const DATASET_CANNOT_HAVE_CHILDREN = 'canNotHaveChildren';

const SCROLL_ALIGN_START = 'start';
const SCROLL_ALIGN_CENTER = 'center';

const PARSE_INT_RADIX = 10;

/**
 * Class definition
 */

class ElementController {
  currentEl!: HTMLElement;
  currentElName!: string;

  // Public
  insert({ name, additionalProps }: { name: string; additionalProps?: Record<string, any> }) {
    const newPageEl = createNewElement(name, additionalProps);
    const domEl = new DomCreator(newPageEl as PageElement).domElement;
    const resolvedParentId = this.resolveParentId();

    elementView.render(domEl, resolvedParentId);
    elementView.click(domEl);

    moveableController.addElementToGuidelines(this.currentEl);

    if (name === ElementsName.Image) {
      (domEl as HTMLImageElement).addEventListener('load', () => {
        moveableController.setTarget(domEl);
      });
    }

    iframeConnection.send(IframeToEditor.StoreElement, {
      ...newPageEl,
      parentId: name === ElementsName.Section ? null : resolvedParentId
    });
  }

  update(updates: Partial<PageElement>) {
    const finalStyle = updates.style
      ? { ...updates.style, ...resolveStyleDependencies(updates.style, this.currentEl) }
      : undefined;

    if (finalStyle) {
      elementView.applyStyles(new StyleGenerator(finalStyle as PageElementStyle).generate());
    }

    if (updates.attrs) {
      elementView.updateAttributes(updates.attrs);
    }

    moveableController.updateRect();

    iframeConnection.send(IframeToEditor.UpdateElement, {
      id: this.currentEl.id,
      updates: { ...updates, style: finalStyle }
    });
  }

  delete() {
    const targetId = this.currentEl.id;
    const parentEl = this.currentEl.parentElement;
    const isSectionEl = this.currentElName === ElementsName.Section;
    const sectionEl = isSectionEl ? this.currentEl.previousElementSibling : this.currentEl.closest(SELECTOR_SECTION);

    if (!sectionEl || !parentEl || !targetId) {
      return;
    }

    this.currentEl.remove();
    elementView.click(sectionEl as HTMLElement);

    iframeConnection.send(IframeToEditor.DeleteElement, targetId);
  }

  changePosition(elementId: string, newIndex: number) {
    const element = document.querySelector(`#${elementId}`) as HTMLElement;
    if (!element) return;

    const parent = element.parentElement;
    if (!parent) return;

    parent.removeChild(element);

    const siblings = [...parent.children];
    const index = Math.max(0, Math.min(newIndex, siblings.length));

    if (index >= siblings.length) {
      parent.append(element);
    } else {
      parent.insertBefore(element, siblings[index]);
    }

    moveableController.clearTarget();

    const newOrder = [...parent.children].map((el) => el.id);
    iframeConnection.send(IframeToEditor.ElementPositionChanged, { newOrder });
  }

  toggleOverlap() {
    const current = this.currentEl;
    if (!current) return;

    const computed = getComputedStyle(current);
    const hasZIndex = computed.zIndex !== 'auto' && computed.zIndex !== '';

    if (this.isOverlapped()) {
      this.update({ style: { position: hasZIndex ? 'relative' : '' } });
    } else {
      this.update({ style: { position: 'absolute' } });
    }
  }

  select(id: string) {
    const el = document.querySelector(`#${id}`) as HTMLElement;

    if (!el) {
      return;
    }

    elementView.click(el);
    elementView.scrollIntoView(this.getScrollAlignment());
    iframeConnection.send(IframeToEditor.SelectElement, id);
  }

  bringToFrontOrSendToBack(shouldBringToFront: boolean) {
    const parentEl = this.currentEl.parentElement;

    if (!parentEl) {
      return;
    }

    const all = [...parentEl.children] as HTMLElement[];

    const others = all
      .filter((el) => el !== this.currentEl)
      .sort((a, b) => {
        const zA = Number.parseInt(getComputedStyle(a).zIndex || '0', PARSE_INT_RADIX);
        const zB = Number.parseInt(getComputedStyle(b).zIndex || '0', PARSE_INT_RADIX);
        return zA - zB;
      });

    if (shouldBringToFront) {
      for (const [index, el] of others.entries()) {
        el.style.zIndex = String(index);
      }
      this.update({ style: { zIndex: others.length } });
    } else {
      this.update({ style: { zIndex: 0 } });
      for (const [index, el] of others.entries()) {
        el.style.zIndex = String(index + 1);
      }
    }
  }

  copy() {
    state.copiedElName = this.currentElName;
    iframeConnection.send(IframeToEditor.CopyElement);
  }

  paste() {
    iframeConnection.send(IframeToEditor.PasteElement);
    moveableController.clearTarget();
  }

  set(el: HTMLElement) {
    const targetName = el.dataset.name;

    if (!targetName) {
      return;
    }

    this.currentEl = el;
    this.currentElName = targetName;

    elementView.updateSelection(el);
  }

  isOverlapped(el?: HTMLElement) {
    const target = el || this.currentEl;
    return getComputedStyle(target).position === 'absolute';
  }

  canAcceptChildren(el?: HTMLElement) {
    return !this.hasDataset(el || this.currentEl, DATASET_CANNOT_HAVE_CHILDREN);
  }

  handleMouseover(event: MouseEvent) {
    const el = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-name]') : null;
    if (!el) return;

    const elName = el.dataset.name;
    const elId = el.id;

    if (this.currentEl.id !== elId) {
      el.classList.add(CLASS_ELEMENT_HOVERED);

      const hoverBox = document.querySelector('.hover-box') as HTMLElement;
      const hoverBadge = hoverBox.querySelector('.hover-badge') as HTMLElement;

      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const borderRadius = Number.parseFloat(style.borderRadius || '0');

      let offset = 0.5;
      if (borderRadius > 0) offset = 5;

      hoverBox.style.width = `${rect.width + offset * 2}px`;
      hoverBox.style.height = `${rect.height + offset * 2}px`;

      hoverBox.style.top = `${rect.top + window.scrollY - offset}px`;
      hoverBox.style.left = `${rect.left + window.scrollX - offset}px`;

      hoverBox.style.display = 'flex';
      hoverBadge.textContent = elName || '';
    }
  }

  handleMouseout(event: MouseEvent) {
    const el = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-name]') : null;
    if (!el) return;

    if (!el.contains(event.relatedTarget as Node)) {
      el.classList.remove(CLASS_ELEMENT_HOVERED);

      const hoverBox = document.querySelector('.hover-box') as HTMLElement;
      hoverBox.style.display = 'none';
    }
  }
  handleInputChange(event: Event) {
    const target = event.target as HTMLElement;
    const isInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

    if (isInput) {
      return;
    }

    const value = target.textContent ?? '';

    this.update({ content: value });
  }

  handleDocumentClick(event: globalThis.MouseEvent) {
    event.stopPropagation();

    const oldEl = this.currentEl;
    const newEl = (event.target as HTMLElement)?.closest('[data-name]') as HTMLElement | null;
    const newElName = newEl?.dataset.name;
    const currentEl = this.currentEl;

    if (newEl) {
      elementView.set(newEl);
      this.set(newEl);
    }

    if (!newEl || !newElName || !currentEl) {
      return;
    }

    this.syncContentEditable(oldEl, newEl);
    this.maybeFocus(newEl);

    this.updateMoveableTarget();
    iframeConnection.send(IframeToEditor.SelectElement, newEl.id);
  }

  // Private
  private maybeFocus(newEl: HTMLElement) {
    const isFocusable = this.hasDataset(newEl, DATASET_FOCUSABLE);

    if (isFocusable) {
      elementView.focus(newEl);
    }
  }

  private resolveParentId(proposedParentId?: string): string {
    const canHaveChildren = !this.hasDataset(this.currentEl, DATASET_CANNOT_HAVE_CHILDREN);

    if (canHaveChildren) {
      return proposedParentId || this.currentEl.id;
    }

    return (this.currentEl.parentElement || (this.currentEl.closest(SELECTOR_SECTION) as HTMLElement)).id;
  }

  private syncContentEditable(oldEl: HTMLElement, newEl: HTMLElement) {
    const isContentEditable = this.hasDataset(newEl, DATASET_CONTENT_EDITABLE);

    if (isContentEditable) {
      newEl.contentEditable = 'true';
    } else if (oldEl.hasAttribute(ATTR_CONTENT_EDITABLE)) {
      oldEl.removeAttribute(ATTR_CONTENT_EDITABLE);
    }
  }

  private updateMoveableTarget() {
    const notMoveable = this.hasDataset(this.currentEl, DATASET_NOT_MOVEABLE);

    if (notMoveable) {
      moveableController.clearTarget();
    } else {
      moveableController.setTarget(this.currentEl);
    }
  }

  private hasDataset(el: HTMLElement, key: string) {
    return key in el.dataset;
  }

  private getScrollAlignment() {
    return this.currentElName === ElementsName.Section ? SCROLL_ALIGN_START : SCROLL_ALIGN_CENTER;
  }
}

export default new ElementController();
