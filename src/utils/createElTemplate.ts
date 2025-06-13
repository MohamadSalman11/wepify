import type { PageElement } from '../types';

const baseProps = {
  fontSize: 20,
  left: 5,
  top: 5,
  padding: { x: 0, y: 0 },
  margin: { x: 0, y: 0 },
  fontFamily: 'Arial',
  fontWeight: 'Regular',
  color: '#000000',
  backgroundColor: '#ffffff',
  children: []
};

export const createElTemplate = (overrides: Partial<PageElement> & { tag: string; name: string }) => {
  return {
    ...baseProps,
    ...overrides
  } as PageElement;
};
