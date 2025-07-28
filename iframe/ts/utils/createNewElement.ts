import { ELEMENTS_TEMPLATE } from '@shared/constants';

export const createNewElement = (name: string, additionalProps: Record<string, any> = {}) => {
  const element = { ...ELEMENTS_TEMPLATE[name] };
  const tagCount = document.querySelectorAll(`[id^="${element.name}"]`).length;
  const newId = `${element.name}-${tagCount + 1}`;
  const newElement = { ...element, id: newId, ...additionalProps };

  return newElement;
};
