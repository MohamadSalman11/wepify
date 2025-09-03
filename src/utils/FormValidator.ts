import { AppToast } from './appToast';

/**
 * Constants
 */

interface Field {
  value: string;
  emptyMessage: string;
  maxLength?: number;
  maxLengthMessage?: string;
}

/**
 * Class definition
 */

export class FormValidator {
  constructor(private fields: Field[]) {}

  // public
  validate() {
    for (const field of this.fields) {
      const error = this.validateField(field);

      if (error) {
        AppToast.error(error);
        return false;
      }
    }

    return true;
  }

  // private
  private validateField(field: Field): string | null {
    const { value, emptyMessage, maxLength, maxLengthMessage } = field;

    const isEmpty = typeof value !== 'string' || value.trim() === '';
    const isTooLong = maxLength !== undefined && value.length > maxLength;

    if (isEmpty) {
      return emptyMessage;
    }

    if (isTooLong) {
      return maxLengthMessage || `Value exceeds ${maxLength} characters.`;
    }

    return null;
  }
}
