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
  scaleFactor: number;
  backgroundColor: string;
  deviceSimulator: DeviceSimulator;
}

/**
 * Class definition
 */

class PageController {
  // public
  render(pageData: PageData) {
    state.scaleFactor = pageData.scaleFactor;

    pageView.renderElements(pageData.elements, pageData.deviceSimulator.type);
    pageView.setBackground(pageData.backgroundColor);
    pageView.setDeviceSimulator(pageData.deviceSimulator);

    if (state.moveable) {
      state.moveable.target = null;
    }

    const target = document.querySelector(SELECTOR_SECTION);

    if (!target) return;

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
    const body = document.querySelector('body');

    if (!body) {
      return;
    }

    Object.assign(body.style, updates);

    if (state.initRender) return;

    iframeConnection.send(IframeToEditor.PageUpdated, updates);
  }
}

export default new PageController();
