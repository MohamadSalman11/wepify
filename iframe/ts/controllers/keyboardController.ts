import { SELECTOR_SECTION } from '../constants';
import { state } from '../model';
import elementController from './elementController';

/**
 * Constants
 */

enum KeyboardKeys {
  F12 = 'F12',
  I = 'I',
  C = 'c',
  V = 'v'
}

/**
 * Class definition
 */

class KeyboardController {
  // public
  handleKeydown(event: KeyboardEvent) {
    const target = state.target;

    if (!target) {
      return;
    }

    if (this.isDevToolsKey(event)) {
      this.openDevToolsSection(target);
      return;
    }

    if (this.isCopyShortcut(event)) {
      event.preventDefault();
      elementController.copy();
      return;
    }

    if (this.isPasteShortcut(event)) {
      event.preventDefault();
      elementController.paste();
    }
  }

  // private
  private isDevToolsKey(event: KeyboardEvent) {
    const key = event.key;

    return (
      key === KeyboardKeys.F12 ||
      (event.ctrlKey && event.shiftKey && key === KeyboardKeys.I) ||
      (event.metaKey && event.altKey && key === KeyboardKeys.I)
    );
  }

  private openDevToolsSection(target: HTMLElement) {
    const sectionElement = target.querySelector(SELECTOR_SECTION) as HTMLElement | null;
    sectionElement?.click();
  }

  private isCopyShortcut(event: KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === KeyboardKeys.C;
  }

  private isPasteShortcut(event: KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === KeyboardKeys.V;
  }
}

export default new KeyboardController();
