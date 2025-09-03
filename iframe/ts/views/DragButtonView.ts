import { SELECTOR_DRAG_BUTTON_ID } from '../constants';
import moveIcon from '/move.png';

/**
 * Constants
 */

const DEFAULT_SCALE_FACTOR = 1;
const DRAG_BUTTON_OFFSET_X = -2;
const DRAG_BUTTON_OFFSET_Y = 16;
const SELECTOR_MOVEABLE_CONTROL = '.moveable-control';

/**
 * Class definition
 */

class DragButtonView {
  private button!: HTMLImageElement;

  // public
  render() {
    const img = document.createElement('img');
    const moveableControl = document.querySelector(SELECTOR_MOVEABLE_CONTROL);

    img.src = moveIcon;
    img.id = SELECTOR_DRAG_BUTTON_ID;

    this.button = img;
    moveableControl?.append(img);
  }

  move(elementHeight: number, scaleFactor: number = DEFAULT_SCALE_FACTOR, borderWidth?: number) {
    const position = this.calculatePosition(elementHeight, scaleFactor, borderWidth);
    this.button.style.transform = `translateZ(0px) translate(${position.x}px, ${position.y}px)`;
  }

  // private
  private calculatePosition(elementHeight: number, scaleFactor: number, borderWidth?: number) {
    const scale = scaleFactor === DEFAULT_SCALE_FACTOR ? 1 : scaleFactor / DEFAULT_SCALE_FACTOR;
    const x = DRAG_BUTTON_OFFSET_X;
    const y = elementHeight * scale + DRAG_BUTTON_OFFSET_Y + (borderWidth || 0);
    return { x, y };
  }
}

export default new DragButtonView();
