import { TAGS_WITHOUT_CHILDREN } from '../constant';
import type { PageElement } from '../types';

const BASE_PROPS = {
  fontSize: 20,
  left: 5,
  top: 5,
  padding: { x: 0, y: 0 },
  margin: { x: 0, y: 0 },
  fontFamily: 'Arial',
  fontWeight: 'Regular',
  color: '#000000',
  backgroundColor: '#f4f8f8',
  children: []
};

export const createElTemplate = (overrides: Partial<PageElement> & { tag: string; name: string }) => {
  const element = {
    ...BASE_PROPS,
    ...overrides
  } as PageElement;

  if (TAGS_WITHOUT_CHILDREN.has(overrides.tag)) {
    delete element.children;
  }

  return element;
};
