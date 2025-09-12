import elementController from './elementController';

/**
 * Constants
 */

enum KeyboardKeys {
  C = 'c',
  V = 'v'
}

/**
 * Class definition
 */

class KeyboardController {
  // public
  handleKeydown(event: KeyboardEvent) {
    const el = elementController.currentEl;

    if (!el) {
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
  private isCopyShortcut(event: KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === KeyboardKeys.C;
  }

  private isPasteShortcut(event: KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === KeyboardKeys.V;
  }
}

export default new KeyboardController();
