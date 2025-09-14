import { IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { DeviceSimulator, PageElement } from '@shared/typing';
import { SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import dragButtonView, { SELECTOR_DRAG_BUTTON } from '../views/dragButtonView';
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
}

export default new PageController();
