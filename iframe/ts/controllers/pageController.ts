import { IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { DeviceSimulator, PageElement } from '@shared/typing';
import { SELECTOR_DRAG_BUTTON, SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import dragButtonView from '../views/dragButtonView';
import pageView from '../views/pageView';
import moveableController from './moveableController';

/**
 * Types
 */

interface PageData {
  elements: PageElement[];
  deviceSimulator: DeviceSimulator;
  backgroundColor: string;
}

/**
 * Class definition
 */

class PageController {
  private bodyEl: HTMLBodyElement | null = document.querySelector('body');

  // public
  render(pageData: PageData) {
    const { elements, deviceSimulator } = pageData;

    pageView.setBackground(pageData.backgroundColor);
    pageView.setDeviceSimulator(deviceSimulator);
    pageView.renderElements(elements, deviceSimulator.type);

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
}

export default new PageController();
