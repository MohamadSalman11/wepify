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
  private pageWrapperEl: HTMLDivElement | null = document.querySelector('.iframe-root-wrapper');
  private pageEl: HTMLDivElement | null = document.querySelector(SELECTOR_ROOT);
  private readonly minScale = 0.3;

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
    const body = document.body;

    if (!body) {
      return;
    }

    body.style.backgroundColor = color;
  }

  setDeviceSimulator(deviceSimulator: DeviceSimulator) {
    if (!this.pageEl) {
      return;
    }

    const scaleFactor = this.calculateScaleFactorToFit(
      { width: document.body.offsetWidth, height: document.body.offsetHeight },
      deviceSimulator
    );

    state.scaleFactor = scaleFactor;
    this.pageEl.style.width = `${deviceSimulator.width + PAGE_PADDING_X}px`;
    this.pageEl.style.transform = `scale(${String(scaleFactor)}) translateZ(0)`;

    this.updatePageWrapperSize();
  }

  zoom(step: number) {
    if (!this.pageEl) {
      return;
    }

    let newScale = state.scaleFactor + step;
    newScale = Math.max(this.minScale, newScale);
    state.scaleFactor = newScale;
    this.pageEl.style.transform = `scale(${state.scaleFactor}) translateZ(0)`;

    this.updatePageWrapperSize();
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

  private updatePageWrapperSize() {
    if (!this.pageWrapperEl || !this.pageEl) {
      return;
    }

    const rawWidth = this.pageEl.offsetWidth;

    this.pageWrapperEl.style.width = `${rawWidth * state.scaleFactor}px`;
  }
}

export default new PageView();
