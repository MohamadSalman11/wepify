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

    const { x, y } = this.getEventCoordinates(event);
    const disabledActions: ContextMenuAction[] = [];

    if (!elementController.canPasteHere()) {
      disabledActions.push(ContextMenuAction.Paste);
    }

    contextMenuView.removeContextMenu();
    contextMenuView.renderContextMenu(x, y, disabledActions, Boolean(state.copiedElName));
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
    const x = 'touches' in event ? (event.touches?.[0]?.clientX ?? 0) : event.clientX;
    const y = 'touches' in event ? (event.touches?.[0]?.clientY ?? 0) : event.clientY;

    const menuEl = document.querySelector(SELECTOR_CONTEXT_MENU) as HTMLElement | null;

    let finalX = x;
    let finalY = y;

    if (menuEl) {
      const menuRect = menuEl.getBoundingClientRect();

      if (x + menuRect.width > window.innerWidth) {
        finalX = Math.max(0, window.innerWidth - menuRect.width);
      }

      if (y + menuRect.height > window.innerHeight) {
        finalY = Math.max(0, window.innerHeight - menuRect.height);
      }
    }

    return { x: finalX, y: finalY };
  }
}

export default new ContextMenuController();
