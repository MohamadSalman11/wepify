import { StyleGenerator } from '@compiler/style/StyleGenerator';
import { getMergedResponsiveStyle } from '@compiler/utils/getMergedResponsiveStyle';
import { resolveStyleDependencies } from '@compiler/utils/resolveStyleDependencies';
import { ElementsName } from '@shared/constants';
import { DeviceType, ImageElement, PageElement, PageElementStyle } from '@shared/typing';

/**
 * Class definition
 */

export class DomCreator {
  public domElement: HTMLElement;

  constructor(
    private pageEl: PageElement & Partial<ImageElement>,
    private device?: DeviceType
  ) {
    this.pageEl = pageEl;
    this.device = device;

    this.domElement = this.createEl();
  }

  private createEl() {
    const { id, tag, name } = this.pageEl;
    const domEl = document.createElement(tag);
    const mergedStyle = this.getMergedStyle();
    const resolvedStyle = resolveStyleDependencies(mergedStyle, domEl);
    const inlineStyle = new StyleGenerator(resolvedStyle as PageElementStyle).generate();

    if (name === ElementsName.Button) {
      domEl.insertAdjacentHTML('afterbegin', '<span></span>');
    }

    this.maybeApplyProperties(domEl);

    domEl.id = id;
    domEl.dataset.name = name;
    Object.assign(domEl.style, inlineStyle);

    return domEl;
  }

  private maybeApplyProperties(domEl: HTMLElement) {
    let targetEl: HTMLElement = domEl;
    const { name, content, attrs, moveable, contentEditable, focusable, canHaveChildren, url } = this.pageEl;

    if (name === ElementsName.Button) {
      const span = domEl.querySelector('span');
      if (span) targetEl = span as HTMLElement;
    }

    if (contentEditable) {
      domEl.dataset.contentEditable = '';
      targetEl.spellcheck = false;
      targetEl.contentEditable = 'true';
    }

    if (content) targetEl.textContent = content;
    if (focusable) domEl.dataset.focusable = '';
    if (!moveable) domEl.dataset.notMoveable = '';
    if (!canHaveChildren) domEl.dataset.canNotHaveChildren = '';
    if (attrs) Object.assign(domEl, attrs);

    if (domEl instanceof HTMLImageElement) {
      if (url) domEl.src = url;
      if (this.pageEl.blobId) domEl.dataset.blobId = this.pageEl.blobId;
    }
  }

  private getMergedStyle() {
    return this.device
      ? getMergedResponsiveStyle(this.pageEl.style, this.pageEl.responsive, this.device)
      : this.pageEl.style;
  }
}
