import { nanoid } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE } from '@shared/constants';

export const createNewElement = (name: string, additionalProps: Record<string, any> = {}) => {
  const element = { ...ELEMENTS_TEMPLATE[name] };
  const newElement = { ...element, id: nanoid(), ...additionalProps };

  return newElement;
};
