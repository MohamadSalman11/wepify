import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 8);

export const generateElementId = (elName: string) => {
  return `${elName}-${nanoid()}`;
};
