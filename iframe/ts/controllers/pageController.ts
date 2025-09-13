import { DomCreator } from '@compiler/dom/DomCreator';
import { ElementsName, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { DeviceSimulator, PageElement } from '@shared/typing';
import { SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import { generateElementId } from '../utils/generateElementId';
import dragButtonView, { SELECTOR_DRAG_BUTTON } from '../views/dragButtonView';
import elementView from '../views/elementView';
import pageView from '../views/pageView';
import elementController from './elementController';
import moveableController from './moveableController';

/**
 * Types
 */

interface PageData {
  elements: PageElement[];
  deviceSimulator: DeviceSimulator;
  backgroundColor?: string;
}

/**
 * Class definition
 */

class PageController {
  private bodyEl: HTMLBodyElement | null = document.querySelector('body');

  // public
  render(pageData: PageData, isDeviceChanged?: boolean) {
    const { elements, deviceSimulator, backgroundColor } = pageData;

    pageView.renderElements(elements, deviceSimulator.type);

    if (backgroundColor) {
      pageView.setBackground(backgroundColor);
    }

    const target = document.querySelector(SELECTOR_SECTION);

    if (!target) {
      return;
    }

    target.click();

    if (state.initRender) {
      moveableController.init();
      dragButtonView.render();
      state.initRender = false;
    } else {
      moveableController.initGuidelines();
    }

    moveableController.setDragTarget(document.querySelector(SELECTOR_DRAG_BUTTON) as SVGAElement);

    if (!isDeviceChanged) {
      iframeConnection.send(IframeToEditor.PageRendered);
      iframeConnection.send(IframeToEditor.SelectElement, target.id);
    }
  }

  update(updates: { backgroundColor: string }) {
    if (!this.bodyEl) {
      return;
    }

    Object.assign(this.bodyEl.style, updates);

    if (state.initRender) return;

    iframeConnection.send(IframeToEditor.PageUpdated, updates);
  }

  renderElements(elements: PageElement[]) {
    let index = 0;
    let firstElement: HTMLElement | undefined;
    const idMap: Record<string, string> = {};

    for (const element of elements) {
      const newElementId = generateElementId();
      const parentId = element.parentId;
      const currentSectionEl = document.querySelector('[data-selected-section]') as HTMLElement;
      const currentElId = elementController.currentEl.id;

      idMap[element.id] = newElementId;
      element.id = newElementId;

      if (currentSectionEl && element.name !== ElementsName.Section) {
        element.parentId = idMap[parentId || ''] || currentSectionEl.id;
      }

      const domEl = new DomCreator(element, state.deviceSimulator.type).domElement;

      if (index === 0) {
        firstElement = domEl;

        if (elementController.currentElName !== ElementsName.Section) {
          element.parentId = currentElId;
        }
      }

      index += 1;
      elementView.render(domEl, index - 1 === 0 ? currentElId : element.parentId);
      iframeConnection.send(IframeToEditor.StoreElement, element);
    }

    firstElement?.scrollIntoView({ block: 'center' });
  }
}

export default new PageController();
