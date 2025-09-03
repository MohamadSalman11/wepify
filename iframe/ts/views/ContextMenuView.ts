import { ContextMenuAction, ID_CONTEXT_MENU, SELECTOR_CONTEXT_MENU } from '../contextMenu';

/**
 * Constants
 */

const SELECTOR_BODY = 'body';

/**
 * Class definition
 */

class ContextMenuView {
  renderContextMenu(x: number, y: number) {
    const bodyEl = document.querySelector(SELECTOR_BODY);

    if (!bodyEl) {
      return;
    }

    const existing = document.querySelector(SELECTOR_CONTEXT_MENU);
    existing?.remove();

    bodyEl.insertAdjacentHTML('beforeend', this.generateMarkup(x, y));
  }

  removeContextMenu() {
    document.querySelector(SELECTOR_CONTEXT_MENU)?.remove();
  }

  private generateMarkup(x: number, y: number) {
    return `
    <ul id="${ID_CONTEXT_MENU}" style="left:${x}px; top:${y}px;">
      <li data-action="${ContextMenuAction.Copy}"><img src="/clipboard-copy.svg" alt="Copy"/> Copy</li>
      <li data-action="${ContextMenuAction.Paste}"><img src="/clipboard-paste.svg" alt="Paste"/> Paste</li>
      <li data-action="${ContextMenuAction.BringToFront}"><img src="/bring-to-front.svg" alt="Bring to Front"/> Bring to Front</li>
      <li data-action="${ContextMenuAction.SendToBack}"><img src="/send-to-back.svg" alt="Send to Back"/> Send to Back</li>
      <li data-action="${ContextMenuAction.Delete}"><img src="/trash.svg" alt="Delete"/> Delete</li>
    </ul>
  `;
  }
}

export default new ContextMenuView();
