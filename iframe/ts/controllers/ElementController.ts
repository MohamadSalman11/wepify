import { resolveStyleDependencies } from '@compiler/utils/resolveStyleDependencies';
import { ElementsName, ID_FIRST_SECTION, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { SELECTOR_SECTION } from '../constants';
import { createNewElement } from '../utils/createNewElement';
import elementView from '../views/elementView';
import moveableController from './moveableController';

/**
 * Constants
 */

const ATTR_CONTENT_EDITABLE = 'contenteditable';
const SELECTOR_FIRST_SECTION = `#${ID_FIRST_SECTION}`;

const DATASET_NOT_MOVEABLE = 'notMoveable';
const DATASET_FOCUSABLE = 'focusable';
const DATASET_CONTENT_EDITABLE = 'contentEditable';
const DATASET_CANNOT_HAVE_CHILDREN = 'canNotHaveChildren';

const SCROLL_ALIGN_START = 'start';
const SCROLL_ALIGN_CENTER = 'center';

const Z_INDEX_INCREMENT = 1;
const Z_INDEX_DECREMENT = 1;

const PARSE_INT_RADIX = 10;

/**
 * Class definition
 */

class ElementController {
  private currentEl!: HTMLElement;
  private currentElName!: string;

  // Public
  insert({
    name,
    pageEl,
    additionalProps
  }: {
    name?: string;
    pageEl?: PageElement & Partial<LastDeletedElement>;
    additionalProps?: Record<string, any>;
  }) {
    if (pageEl) {
      this.restoreExistingEl(pageEl);
    } else if (name) {
      this.insertNewEl(name, additionalProps);
    }

    moveableController.addElementToGuidelines(this.currentEl);
  }

  update(updates: Partial<PageElement>) {
    const finalStyle = updates.style
      ? { ...updates.style, ...resolveStyleDependencies(updates.style, this.currentEl) }
      : undefined;

    if (finalStyle) {
      elementView.applyStyles(generateInlineStyle(finalStyle));
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
    const targetEl = this.currentEl;
    const targetId = this.currentEl.id;
    const parentEl = this.currentEl.parentElement;
    const isSectionEl = this.currentElName === ElementsName.Section;
    const isFirstSectionEl = targetId === ID_FIRST_SECTION;
    const sectionEl = isSectionEl ? this.currentEl.previousElementSibling : this.currentEl.closest(SELECTOR_SECTION);

    if (!sectionEl || !parentEl || !targetId || isFirstSectionEl) {
      return;
    }

    const deletedIds = this.collectDeletedIds(targetEl);

    this.currentEl.remove();
    elementView.click(sectionEl as HTMLElement);

    const updatedIdsMap = this.assignUniqueIdsToDomElementTree(parentEl);

    console.log('Updated IDs Map:', updatedIdsMap);
    console.log('Deleted IDs:', deletedIds);

    iframeConnection.send('DELETE_ELEMENT', {
      updatedIdsMap,
      deletedIds
    });
  }

  select(id: string) {
    const el = document.querySelector(`#${id}`) as HTMLElement;

    if (!el) {
      return;
    }

    elementView.click(el);
    elementView.scrollIntoView(this.getScrollAlignment());

    // iframeConnection.send(MessageFromIframe.SelectionChanged, domToPageElement(el) as PageElement);
  }

  bringToFrontOrSendToBack(shouldBringToFront: boolean) {
    const parentEl = this.currentEl.parentElement;

    if (!parentEl) {
      return;
    }

    const extremeSiblingZIndex = this.getExtremeSiblingZIndex(parentEl, shouldBringToFront);

    const newZIndex = shouldBringToFront
      ? extremeSiblingZIndex + Z_INDEX_INCREMENT
      : extremeSiblingZIndex - Z_INDEX_DECREMENT;

    this.update({ style: { zIndex: newZIndex } });
  }

  copy() {
    iframeConnection.send('COPY_ELEMENT');
  }

  paste() {
    iframeConnection.send('PASTE_ELEMENT');
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

  handleDocumentClick(event: globalThis.MouseEvent) {
    event.stopPropagation();

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

    this.syncContentEditable(newEl);
    this.maybeFocus(newEl);

    this.updateMoveableTarget();
    iframeConnection.send(IframeToEditor.SelectElement, newEl.id);
  }

  // Private
  private insertNewEl(name: string, additionalProps?: Record<string, any>) {
    const newPageEl = createNewElement(name, additionalProps);
    const domEl = createDomFromPageElement(newPageEl as PageElement, 'laptop');
    const resolvedParentId = this.resolveParentId();

    elementView.render(domEl, resolvedParentId);
    elementView.click(domEl);

    iframeConnection.send(IframeToEditor.StoreElement, {
      ...newPageEl,
      parentId: resolvedParentId
    });
  }

  private restoreExistingEl(deletedPageEl: PageElement & Partial<LastDeletedElement>) {
    const { parentId, domIndex } = deletedPageEl;
    const domEl = createDomTree(deletedPageEl);
    const resolvedParentId = this.resolveParentId(parentId);

    deletedPageEl.parentId = undefined;

    elementView.render(domEl, resolvedParentId, domIndex);
    this.assignUniqueIdsToDomElementTree(domEl);

    elementView.click(domEl);
    elementView.scrollIntoView(this.getScrollAlignment());

    iframeConnection.send('ELEMENT_INSERTED', {
      element: deletedPageEl as PageElement,
      parentId: resolvedParentId,
      domIndex: domIndex
    });
  }

  private maybeFocus(newEl: HTMLElement) {
    const isFocusable = hasDataset(newEl, DATASET_FOCUSABLE);

    if (isFocusable) {
      elementView.focus(newEl);
    }
  }

  private resolveParentId(proposedParentId?: string): string {
    const canHaveChildren = !hasDataset(this.currentEl, DATASET_CANNOT_HAVE_CHILDREN);

    if (canHaveChildren) {
      return proposedParentId || this.currentEl.id;
    }

    return (this.currentEl.parentElement || this.currentEl.closest(SELECTOR_SECTION) || { id: SELECTOR_FIRST_SECTION })
      .id;
  }

  private collectDeletedIds(el: HTMLElement): string[] {
    const ids: string[] = [el.id];
    for (const child of [...el.children] as HTMLElement[]) {
      ids.push(...this.collectDeletedIds(child));
    }
    return ids;
  }

  private assignUniqueIdsToDomElementTree(el: HTMLElement): Record<string, { newId?: string; parentId?: string }> {
    const updatedIdsMap: Record<string, { newId?: string; parentId?: string }> = {};
    const baseName = el.dataset.name;
    if (!baseName) return updatedIdsMap;

    const sameElements = [...document.querySelectorAll(`[id^="${baseName}-"]`)];
    let index = 1;

    for (const sameEl of sameElements) {
      const oldId = sameEl.id;
      const newId = `${baseName}-${index++}`;

      if (oldId !== newId) {
        updatedIdsMap[oldId] = updatedIdsMap[oldId] || {};
        updatedIdsMap[oldId].newId = newId;
        sameEl.id = newId;

        for (const child of [...sameEl.children] as HTMLElement[]) {
          updatedIdsMap[child.id] = updatedIdsMap[child.id] || {};
          updatedIdsMap[child.id].parentId = newId;
        }
      }
    }

    for (const child of [...el.children] as HTMLElement[]) {
      const childMap = this.assignUniqueIdsToDomElementTree(child);
      Object.assign(updatedIdsMap, childMap);
    }

    return updatedIdsMap;
  }

  private getExtremeSiblingZIndex(parentEl: HTMLElement, bringToFront: boolean): number {
    let extremeZIndex = 0;

    for (const sibling of parentEl.children) {
      const zIndexStr = globalThis.getComputedStyle(sibling).zIndex || '0';
      const zIndex = Number.parseInt(zIndexStr, PARSE_INT_RADIX);

      if (!Number.isNaN(zIndex)) {
        extremeZIndex = bringToFront ? Math.max(extremeZIndex, zIndex) : Math.min(extremeZIndex, zIndex);
      }
    }

    return extremeZIndex;
  }

  private syncContentEditable(newEl: HTMLElement) {
    const isContentEditable = hasDataset(newEl, DATASET_CONTENT_EDITABLE);

    if (isContentEditable) {
      newEl.contentEditable = 'true';
    } else if (this.currentEl.hasAttribute(ATTR_CONTENT_EDITABLE)) {
      this.currentEl.removeAttribute(ATTR_CONTENT_EDITABLE);
    }
  }

  private updateMoveableTarget() {
    const notMoveable = hasDataset(this.currentEl, DATASET_NOT_MOVEABLE);

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
