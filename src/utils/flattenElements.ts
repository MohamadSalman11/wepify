import type { PageElement } from '@shared/types';

export function flattenElements(elements: PageElement[]): PageElement[] {
  const result: PageElement[] = [];

  for (const el of elements) {
    result.push(el);

    if (el.children?.length) {
      result.push(...flattenElements(el.children));
    }
  }

  return result;
}
