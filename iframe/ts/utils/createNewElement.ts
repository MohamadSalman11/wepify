import { ELEMENTS_TEMPLATE } from '@shared/constants';
import { generateElementId } from './generateElementId';

export const createNewElement = (name: string, additionalProps: Record<string, any> = {}) => {
  const element = { ...ELEMENTS_TEMPLATE[name] };
  const newElement = { ...element, id: generateElementId(name), ...additionalProps };

  return newElement;
};
