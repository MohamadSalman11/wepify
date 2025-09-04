import { IframeToEditor, PAGE_PADDING_X } from '@shared/constants';
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

interface Size {
  width: number;
  height: number;
}

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
    const { elements, deviceSimulator } = pageData;

    const scaleFactor = this.calculateScaleFactor(
      { width: document.body.clientWidth, height: document.body.clientHeight },
      deviceSimulator
    );

    state.scaleFactor = scaleFactor;
    pageView.renderElements(elements, deviceSimulator.type);
    pageView.setDeviceSimulator(deviceSimulator, scaleFactor);

    if (pageData.backgroundColor) {
      pageView.setBackground(pageData.backgroundColor);
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

  // private
  private calculateScaleFactor(containerSize: Size, deviceSize: Size) {
    const needsScaling = deviceSize.width > containerSize.width;

    if (needsScaling) {
      const scaleX = containerSize.width / (deviceSize.width + PAGE_PADDING_X);
      return Math.min(scaleX, 1);
    }

    return 1;
  }
}

export default new PageController();
