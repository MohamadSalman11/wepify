import { APP_SHORT_NAME } from '@shared/constants';
import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 8);

export const generateElementId = () => {
  return `${APP_SHORT_NAME}-${nanoid()}`;
};
