import type { PageElement } from '@shared/types';

export function findElementById(id: string, elements: PageElement[]): PageElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children?.length) {
      const found = findElementById(id, el.children);
      if (found) return found;
    }
  }
  return null;
}
