import type { PageElement } from '../types';

export function flattenElements(elements: PageElement[]): PageElement[] {
  const result: PageElement[] = [];

  const flattenRecursive = (items: PageElement[]) => {
    for (const el of items) {
      result.push(el);
      if (el.children?.length) {
        flattenRecursive(el.children);
      }
    }
  };

  flattenRecursive(elements);
  return result;
}
