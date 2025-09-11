import { DomTreeBuilder } from '@compiler/dom/DomTreeBuilder';
import { PAGE_PADDING_X } from '@shared/constants';
import { DeviceSimulator, DeviceType, PageElement } from '@shared/typing';
import { SELECTOR_ROOT } from '../constants';
import { state } from '../model';

/**
 * Types
 */

type Size = { width: number; height: number };

/**
 * Class definition
 */

class PageView {
  private pageEl: HTMLDivElement | null = document.querySelector(SELECTOR_ROOT);

  // public
  renderElements = (elements: PageElement[], device?: DeviceType) => {
    if (!this.pageEl) {
      return;
    }

    this.pageEl.innerHTML = '';

    const domTreeBuilder = new DomTreeBuilder(elements, device);

    for (const domEl of domTreeBuilder.domTree) {
      this.pageEl.append(domEl);
    }
  };

  setBackground(color: string) {
    const page = document.body;

    if (!page) {
      return;
    }

    page.style.backgroundColor = color;
  }

  setDeviceSimulator(deviceSimulator: DeviceSimulator) {
    const page = document.querySelector(SELECTOR_ROOT) as HTMLIFrameElement;

    if (!page) {
      return;
    }

    const scaleFactor = this.calculateScaleFactorToFit(
      { width: document.body.clientWidth, height: document.body.clientHeight },
      deviceSimulator
    );

    state.scaleFactor = scaleFactor;
    page.style.width = `${deviceSimulator.width + PAGE_PADDING_X}px`;
    page.style.height = `${deviceSimulator.height}px`;
    page.style.transform = `scale(${String(scaleFactor)})`;
    page.style.transformOrigin = 'top left';
  }

  zoom(step: number) {
    if (!this.pageEl) {
      return;
    }

    state.scaleFactor = state.scaleFactor + step;
    this.pageEl.style.transform = `scale(${state.scaleFactor})`;
    this.pageEl.style.transformOrigin = 'top left';
  }

  // private
  private calculateScaleFactorToFit(containerSize: Size, deviceSize: Size) {
    const needsScaling = deviceSize.width > containerSize.width;

    if (needsScaling) {
      const scaleX = containerSize.width / (deviceSize.width + PAGE_PADDING_X);
      return Math.min(scaleX, 1);
    }

    return 1;
  }
}

export default new PageView();
