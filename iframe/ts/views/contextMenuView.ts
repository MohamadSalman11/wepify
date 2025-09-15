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

  // public
  renderContextMenu(x: number, y: number, disabledActions: ContextMenuAction[] = [], isAnyElCopied: boolean) {
    if (!this.bodyEl) {
      return;
    }

    const existing = document.querySelector(SELECTOR_CONTEXT_MENU);

    existing?.remove();
    this.bodyEl.insertAdjacentHTML('beforeend', this.generateMarkup(x, y, disabledActions, isAnyElCopied));
    this.maybeChangeMenuPosition(x, y);
  }

  removeContextMenu() {
    document.querySelector(SELECTOR_CONTEXT_MENU)?.remove();
  }

  // private
  private generateMarkup(x: number, y: number, disabledActions: ContextMenuAction[] = [], isAnyElCopied: boolean) {
    const isDisabled = (action: ContextMenuAction) => disabledActions.includes(action);

    const isOverlapped = elementController.isOverlapped();
    const isWrapped = elementController.isWrapped();
    const isHidden = elementController.isHidden();

    const overlapText = isOverlapped ? 'Disable Overlap' : 'Allow Overlap';
    const wrapText = isWrapped ? 'Disable Wrap' : 'Allow Wrap';
    const visibilityText = isHidden ? 'Show' : 'Hide';
    const overlapIcon = isOverlapped ? 'overlap-off' : 'overlap-on';
    const wrapIcon = isWrapped ? 'wrap-off' : 'wrap-on';
    const visibilityIcon = isHidden ? 'eye-on' : 'eye-off';

    const isPasteDisabled = isDisabled(ContextMenuAction.Paste);
    const isOverlapDisabled = isDisabled(ContextMenuAction.ToggleWrap);

    return `
      <ul class="${CLASS_CONTEXT_MENU}" style="left:${x}px; top:${y}px;">
        <li data-action="${ContextMenuAction.Copy}" class="${isDisabled(ContextMenuAction.Copy) ? 'disabled' : ''}">
         ${this.getSvgMarkup('clipboard-copy')} Copy
        </li>
        <li
          data-action="${ContextMenuAction.Paste}"
          class="${isPasteDisabled || !isAnyElCopied ? 'disabled' : ''} ${isPasteDisabled ? 'not-allowed' : ''}"
        >
         ${this.getSvgMarkup('clipboard-paste')} Paste
        </li>
        <li
          data-action="${ContextMenuAction.BringToFront}"
          class="${isDisabled(ContextMenuAction.BringToFront) ? 'disabled' : ''}"
        >
          ${this.getSvgMarkup('bring-to-front')} Bring to Front
        </li>
        <li
          data-action="${ContextMenuAction.SendToBack}"
          class="${isDisabled(ContextMenuAction.SendToBack) ? 'disabled' : ''}"
        >
          ${this.getSvgMarkup('send-to-back')} Send to Back
        </li>
        <li data-action="${ContextMenuAction.ToggleOverlap}">
          ${this.getSvgMarkup(overlapIcon)} ${overlapText}
        </li>
        <li data-action="${ContextMenuAction.ToggleWrap}" class="${isOverlapDisabled ? 'disabled not-allowed' : ''}">
         ${this.getSvgMarkup(wrapIcon)} ${wrapText}
         </li>
        <li data-action="${ContextMenuAction.ToggleVisibility}">
        ${this.getSvgMarkup(visibilityIcon)} ${visibilityText}
        </li>
        <li data-action="${ContextMenuAction.Delete}" class="${isDisabled(ContextMenuAction.Delete) ? 'disabled' : ''}">
          ${this.getSvgMarkup('trash')} Delete
        </li>
      </ul>
    `;
  }

  private getSvgMarkup(id: string) {
    return `<svg><use href="/sprite.svg#${id}"></use></svg>`;
  }

  private maybeChangeMenuPosition(x: number, y: number) {
    const menuEl = document.querySelector(SELECTOR_CONTEXT_MENU) as HTMLUListElement;

    if (!menuEl) {
      return { x, y };
    }

    let finalX = x;
    let finalY = y;
    let changed = false;
    const menuRect = menuEl.getBoundingClientRect();

    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;

    if (menuRect.right > docWidth) {
      finalX = Math.max(0, x - (menuRect.right - docWidth));
      changed = true;
    }

    if (menuRect.bottom > docHeight) {
      finalY = Math.max(0, y - (menuRect.bottom - docHeight));
      changed = true;
    }

    if (changed) {
      menuEl.style.left = `${finalX}px`;
      menuEl.style.top = `${finalY}px`;
    }
  }
}

export default new ContextMenuView();
