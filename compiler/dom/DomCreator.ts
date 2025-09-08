import { StyleGenerator } from '@compiler/style/StyleGenerator';
import { getMergedResponsiveStyle } from '@compiler/utils/getMergedResponsiveStyle';
import { ElementsName } from '@shared/constants';
import { DeviceType, ImageElement, PageElement } from '@shared/typing';

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
    const inlineStyle = new StyleGenerator(mergedStyle).generate();

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
    const { name, content, attrs, moveable, contentEditable, focusable, url } = this.pageEl;

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
    if (attrs) Object.assign(domEl, attrs);

    if (url && domEl instanceof HTMLImageElement) {
      domEl.src = url;
      domEl.addEventListener('load', () => domEl.click());
    }
  }

  private getMergedStyle() {
    return this.device
      ? getMergedResponsiveStyle(this.pageEl.style, this.pageEl.responsive, this.device)
      : this.pageEl.style;
  }
}
