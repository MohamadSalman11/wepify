import { extractTransform } from '@compiler/utils/extractTransform';
import { ElementsName } from '@shared/constants';
import Moveable, { MoveableProps, OnDrag, OnResize, OnRotate } from 'moveable';
import { SELECTOR_ROOT } from '../constants';
import { state } from '../model';
import dragButtonView from '../views/dragButtonView';
import elementController from './elementController';

/**
 * Constants
 */

const MOVEABLE_PADDING = 10;
const ELEMENTS_WITH_PADDING = new Set([ElementsName.Heading, ElementsName.Text, ElementsName.Link]);

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
  private moveable: Moveable = {} as Moveable;

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
    const shouldAddPadding = ELEMENTS_WITH_PADDING.has(target.dataset.name as ElementsName);

    this.moveable.target = target;
    this.moveable.padding = shouldAddPadding ? MOVEABLE_PADDING : 0;

    this.updateDragButton(target);
  }

  clearTarget() {
    if (this.moveable.target !== null) {
      this.moveable.target = null;
    }
  }

  updateRect() {
    this.moveable.updateRect();

    if (this.moveable.target) {
      this.setTarget(this.moveable.target as HTMLElement);
    }
  }

  initGuidelines() {
    this.moveable.elementGuidelines = [
      ...(document.querySelector(SELECTOR_ROOT)?.querySelectorAll('[data-name]') || [])
    ];
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
      .on('render', ({ target }) => this.updateDragButton(target as HTMLElement));
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
      style: { width, height }
    });
  }

  private onRotate(event: OnRotate) {
    const { rotate } = extractTransform(event.transform);

    elementController.update({ style: { rotate } });
  }

  private updateDragButton(target: HTMLElement) {
    const clientHeight = target.offsetHeight;
    const extraPadding = ELEMENTS_WITH_PADDING.has(target.dataset.name as ElementsName) ? MOVEABLE_PADDING * 3.2 : 0;

    dragButtonView.move(clientHeight + extraPadding, state.scaleFactor);
  }
}

export default new MoveableController();
