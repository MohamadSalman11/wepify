import { extractTransform } from '@compiler/utils/extractTransform';
import { PAGE_PADDING, PAGE_PADDING_X } from '@shared/constants';
import Moveable, { MoveableProps, OnDrag, OnResize, OnRotate } from 'moveable';
import { SELECTOR_ROOT } from '../constants';
import { state } from '../model';
import { getVerticalBorderSum } from '../utils/getVerticalBorderSum';
import dragButtonView from '../views/dragButtonView';
import elementController from './elementController';

/**
 * Constants
 */

const CONFIG: MoveableProps = {
  target: null,
  draggable: true,
  dragTarget: null,
  resizable: true,
  scalable: true,
  rotatable: true,
  dragTargetSelf: true,
  origin: true,
  snappable: true,
  snapDirections: {
    left: true,
    top: true,
    right: true,
    bottom: true,
    center: true,
    middle: true
  },
  elementSnapDirections: {
    left: true,
    top: true,
    right: true,
    bottom: true,
    center: true,
    middle: true
  },
  snapRotationDegrees: [0, 45, 90, 135, 180, 225, 270, 315]
};

/**
 * Class definition
 */

class MoveableController {
  private moveable!: Moveable;

  // private
  init() {
    const container = document.body;

    this.moveable = new Moveable(container, CONFIG);

    this.initGuidelines();
    this.attachEventListeners();
  }

  setDragTarget(target: SVGElement) {
    this.moveable.dragTarget = target;
  }

  setTarget(target: HTMLElement) {
    this.moveable.target = target;
    dragButtonView.move(target.clientHeight, state.scaleFactor, getVerticalBorderSum(target));
  }

  clearTarget() {
    this.moveable.target = null;
  }

  updateRect() {
    this.moveable.updateRect();
  }

  initGuidelines() {
    this.moveable.elementGuidelines = [...(document.querySelector(SELECTOR_ROOT)?.querySelectorAll('*') || [])];
    this.moveable.horizontalGuidelines = [0, document.body.clientWidth / 2, document.body.clientWidth];
    this.moveable.verticalGuidelines = [0, document.body.clientHeight / 2, document.body.clientHeight];
  }

  addElementToGuidelines(domElement: HTMLElement) {
    this.moveable.elementGuidelines = [...(this.moveable.elementGuidelines ?? []), domElement];
  }

  // private
  private attachEventListeners() {
    this.moveable
      .on('drag', this.onDrag)
      .on('resize', this.onResize)
      .on('rotate', this.onRotate)
      .on('render', ({ target }) => {
        dragButtonView.move(target.clientHeight, state.scaleFactor, getVerticalBorderSum(target as HTMLElement));
      });
  }

  private onDrag = (event: OnDrag) => {
    const { left, top } = extractTransform(event.transform);

    elementController.update({ style: { left, top } });
  };

  private onResize(event: OnResize) {
    const { width, height } = event;
    const sectionEl = document.querySelector(SELECTOR_ROOT);

    if (!sectionEl) {
      return;
    }

    elementController.update({
      style: {
        width: width === sectionEl.clientWidth - PAGE_PADDING_X ? 'fill' : width,
        height: height === sectionEl.clientHeight - PAGE_PADDING ? 'fill' : height
      }
    });
  }

  private onRotate(event: OnRotate) {
    const { rotate } = extractTransform(event.transform);

    elementController.update({ style: { rotate } });
  }
}

export default new MoveableController();
