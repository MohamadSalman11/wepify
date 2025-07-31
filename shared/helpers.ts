import { TAGS_WITHOUT_CHILDREN } from './constants';
import type { PageElement } from './typing';

const BASE_PROPS = {
  fontSize: { monitor: 20 },
  fontFamily: 'Inter',
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
