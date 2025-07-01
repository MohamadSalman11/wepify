import { ELEMENTS_TEMPLATE } from '@shared/constants';
import { SELECTOR_TARGET } from '../constants';

export const createNewElement = (name: string, additionalProps: Record<string, any> = {}) => {
  const element = { ...ELEMENTS_TEMPLATE[name] };
  const tagCount = document.querySelectorAll(`${element.tag}${SELECTOR_TARGET}`).length;
  const newId = `${element.name}-${tagCount + 1}`;
  const newElement = { ...element, id: newId, ...additionalProps };

  return newElement;
};
