import { DomCreator } from '@compiler/dom/DomCreator';
import { ElementsName, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { DeviceSimulator, PageElement } from '@shared/typing';
import { SELECTOR_DRAG_BUTTON, SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import dragButtonView from '../views/dragButtonView';
import elementView from '../views/elementView';
import pageView from '../views/pageView';
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
  render(pageData: PageData) {
    const { elements, deviceSimulator, backgroundColor } = pageData;

    pageView.setDeviceSimulator(deviceSimulator);
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
      const existingCount = document.querySelectorAll(`[data-name='${element.name}']`).length;
      const newElementId = `${element.name}-${existingCount + 1}`;
      const parentId = element.parentId;
      const currentSectionEl = document.querySelector('[data-selected-section]') as HTMLElement;

      idMap[element.id] = newElementId;
      element.id = newElementId;

      if (currentSectionEl && element.name !== ElementsName.Section) {
        element.parentId = idMap[parentId || ''] || currentSectionEl.id;
      }

      const domEl = new DomCreator(element).domElement;

      if (index === 0) {
        firstElement = domEl;
      }

      index += 1;
      elementView.render(domEl, element.parentId);
      iframeConnection.send(IframeToEditor.StoreElement, element);
    }

    firstElement?.scrollIntoView();
  }
}

export default new PageController();
