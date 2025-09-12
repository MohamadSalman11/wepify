import moveIcon from '/move.png';

/**
 * Constants
 */

const DEFAULT_SCALE_FACTOR = 1;
const DRAG_BUTTON_OFFSET_X = -2;
const DRAG_BUTTON_OFFSET_Y = 16;

const CLASS_DRAG_TARGET_BUTTON = 'drag-target-button';
const SELECTOR_MOVEABLE_CONTROL = '.moveable-control';
export const SELECTOR_DRAG_BUTTON = `.${CLASS_DRAG_TARGET_BUTTON}`;

/**
 * Class definition
 */

class DragButtonView {
  private button!: HTMLImageElement;

  // public
  render() {
    const img = document.createElement('img');
    const moveableControlEl = document.querySelector(SELECTOR_MOVEABLE_CONTROL);

    if (!moveableControlEl) {
      return;
    }

    img.src = moveIcon;
    img.classList.add(CLASS_DRAG_TARGET_BUTTON);

    this.button = img;
    moveableControlEl.append(img);
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
