import { ContextMenuAction, SELECTOR_CONTEXT_MENU, SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import contextMenuView from '../views/contextMenuView';
import elementController from './elementController';

/**
 * Constants
 */

const SELECTOR_LIST_ITEM = 'li';
const SELECTOR_MOVEABLE_CONTROL_BOX = '.moveable-control-box';
const LONG_PRESS_DURATION = 500;

const actions: Record<ContextMenuAction, () => void> = {
  [ContextMenuAction.Copy]: () => elementController.copy(),
  [ContextMenuAction.Paste]: () => elementController.paste(),
  [ContextMenuAction.Delete]: () => elementController.delete(),
  [ContextMenuAction.AllowOverlap]: () => elementController.allowOverlap(),
  [ContextMenuAction.BringToFront]: () => elementController.bringToFrontOrSendToBack(true),
  [ContextMenuAction.SendToBack]: () => elementController.bringToFrontOrSendToBack(false)
};

/**
 * Class definition
 */

class ContextMenuController {
  // public
  show(event: MouseEvent | TouchEvent) {
    event.preventDefault();

    const closestSection = (event.target as HTMLElement).closest(SELECTOR_SECTION);
    const moveableControlBox = (event.target as HTMLElement).closest(SELECTOR_MOVEABLE_CONTROL_BOX);

    if (!closestSection && !moveableControlBox) {
      return;
    }

    const { pageX, pageY } = this.getEventCoordinates(event);

    contextMenuView.removeContextMenu();
    contextMenuView.renderContextMenu(pageX, pageY);
  }

  handleAction(event: globalThis.MouseEvent) {
    const action = (event.target as HTMLElement).closest(SELECTOR_LIST_ITEM)?.dataset.action;
    const handler = actions[action as ContextMenuAction];

    handler?.();
  }

  handleTouchStart(event: TouchEvent) {
    state.longPressTimer = setTimeout(() => {
      event.preventDefault();
      this.show(event);
    }, LONG_PRESS_DURATION);
  }

  handleTouchEnd = () => {
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }
  };

  handleDocumentClick(event: globalThis.MouseEvent) {
    const clickedInside = (event.target as HTMLElement)?.closest(SELECTOR_CONTEXT_MENU);

    if (clickedInside) {
      this.handleAction(event);
    }

    contextMenuView.removeContextMenu();
  }

  // private
  private getEventCoordinates(event: MouseEvent | TouchEvent) {
    const pageX = 'touches' in event ? (event.touches?.[0]?.pageX ?? 0) : event.pageX;
    const pageY = 'touches' in event ? (event.touches?.[0]?.pageY ?? 0) : event.pageY;
    return { pageX, pageY };
  }
}

export default new ContextMenuController();
