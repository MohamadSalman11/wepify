import { ContextMenuAction } from '../controllers/contextMenuController';
import elementController from '../controllers/elementController';

/**
 * Constants
 */

const SELECTOR_BODY = 'body';
const CLASS_CONTEXT_MENU = 'context-menu';
export const SELECTOR_CONTEXT_MENU = `.${CLASS_CONTEXT_MENU}`;

/**
 * Class definition
 */

class ContextMenuView {
  private bodyEl: HTMLBodyElement | null = document.querySelector(SELECTOR_BODY);

  renderContextMenu(x: number, y: number, disabledActions: ContextMenuAction[] = [], isAnyElCopied: boolean) {
    if (!this.bodyEl) {
      return;
    }

    const existing = document.querySelector(SELECTOR_CONTEXT_MENU);
    existing?.remove();

    this.bodyEl.insertAdjacentHTML('beforeend', this.generateMarkup(x, y, disabledActions, isAnyElCopied));
  }

  removeContextMenu() {
    document.querySelector(SELECTOR_CONTEXT_MENU)?.remove();
  }

  private generateMarkup(x: number, y: number, disabledActions: ContextMenuAction[] = [], isAnyElCopied: boolean) {
    const isOverlapped = elementController.isOverlapped();
    const overlapText = isOverlapped ? 'Disable Overlap' : 'Allow Overlap';
    const overlapIcon = isOverlapped ? '/overlap-off.svg' : '/overlap-on.svg';
    const isDisabled = (action: ContextMenuAction) => disabledActions.includes(action);
    const isPasteDisabled = isDisabled(ContextMenuAction.Paste);

    return `
      <ul class="${CLASS_CONTEXT_MENU}" style="left:${x}px; top:${y}px;">
        <li data-action="${ContextMenuAction.Copy}" class="${isDisabled(ContextMenuAction.Copy) ? 'disabled' : ''}">
          <img src="/clipboard-copy.svg" alt="Copy" /> Copy
        </li>
        <li
          data-action="${ContextMenuAction.Paste}"
          class=" ${isPasteDisabled || !isAnyElCopied ? 'disabled' : ''} ${isPasteDisabled ? 'not-allowed' : ''}"
        >
          <img src="/clipboard-paste.svg" alt="Paste" /> Paste
        </li>
        <li
          data-action="${ContextMenuAction.BringToFront}"
          class="${isDisabled(ContextMenuAction.BringToFront) ? 'disabled' : ''}"
        >
          <img src="/bring-to-front.svg" alt="Bring to Front" /> Bring to Front
        </li>
        <li
          data-action="${ContextMenuAction.SendToBack}"
          class="${isDisabled(ContextMenuAction.SendToBack) ? 'disabled' : ''}"
        >
          <img src="/send-to-back.svg" alt="Send to Back" /> Send to Back
        </li>
        <li data-action="${ContextMenuAction.ToggleOverlap}">
          <img src="${overlapIcon}" alt="${overlapText}" /> ${overlapText}
        </li>
        <li data-action="${ContextMenuAction.Delete}" class="${isDisabled(ContextMenuAction.Delete) ? 'disabled' : ''}">
          <img src="/trash.svg" alt="Delete" /> Delete
        </li>
      </ul>
    `;
  }
}

export default new ContextMenuView();
