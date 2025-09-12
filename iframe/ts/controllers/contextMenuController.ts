import { SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import contextMenuView, { SELECTOR_CONTEXT_MENU } from '../views/contextMenuView';
import elementController from './elementController';

/**
 * Constants
 */

const LONG_PRESS_DURATION = 500;
const SELECTOR_LIST_ITEM = 'li';
const SELECTOR_MOVEABLE_CONTROL_BOX = '.moveable-control-box';

export enum ContextMenuAction {
  Copy = 'copy',
  Paste = 'paste',
  BringToFront = 'bring-to-front',
  SendToBack = 'send-to-back',
  ToggleOverlap = 'toggle-overlap',
  Delete = 'delete'
}

const actions: Record<ContextMenuAction, () => void> = {
  [ContextMenuAction.Copy]: () => elementController.copy(),
  [ContextMenuAction.Paste]: () => elementController.paste(),
  [ContextMenuAction.Delete]: () => elementController.delete(),
  [ContextMenuAction.ToggleOverlap]: () => elementController.toggleOverlap(),
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

    const targetEl = event.target as HTMLElement;
    const closestSection = targetEl.closest(SELECTOR_SECTION);
    const moveableControlBox = targetEl.closest(SELECTOR_MOVEABLE_CONTROL_BOX);

    if (!closestSection && !moveableControlBox) {
      return;
    }

    const { pageX, pageY } = this.getEventCoordinates(event);
    const disabledActions: ContextMenuAction[] = [];

    if (!elementController.canPasteHere()) {
      disabledActions.push(ContextMenuAction.Paste);
    }

    contextMenuView.removeContextMenu();
    contextMenuView.renderContextMenu(pageX, pageY, disabledActions, Boolean(state.copiedElName));
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
    const target = event.target as HTMLElement;
    const contextMenu = target.closest(SELECTOR_CONTEXT_MENU);

    if (!contextMenu) {
      contextMenuView.removeContextMenu();
      return;
    }

    const listItem = target.closest(SELECTOR_LIST_ITEM) as HTMLElement | null;
    const isActionDisabled = listItem?.classList.contains('disabled');

    if (listItem && !isActionDisabled) {
      this.handleAction(event);
    }

    if (!isActionDisabled) {
      contextMenuView.removeContextMenu();
    }
  }

  // private
  private getEventCoordinates(event: MouseEvent | TouchEvent) {
    const pageX = 'touches' in event ? (event.touches?.[0]?.pageX ?? 0) : event.pageX;
    const pageY = 'touches' in event ? (event.touches?.[0]?.pageY ?? 0) : event.pageY;
    return { pageX, pageY };
  }
}

export default new ContextMenuController();
