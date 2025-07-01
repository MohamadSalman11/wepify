import { TAGS_WITHOUT_CHILDREN } from './constants';
import type { PageElement } from './types';

const BASE_PROPS = {
  fontSize: 20,
  left: 0,
  top: 0,
  padding: { x: 0, y: 0 },
  margin: { x: 0, y: 0 },
  fontFamily: 'Inter',
  fontWeight: 'Regular',
  color: '#000000',
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
