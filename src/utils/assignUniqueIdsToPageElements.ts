import { PageElement } from '@shared/typing';

export const assignUniqueIdsToPageElements = (element: PageElement, elements: PageElement[]) => {
  let index = 1;
  const sameElements = elements.filter((el) => el.name === element.name);

  for (const sameElement of sameElements) {
    sameElement.id = `${sameElement.name}-${index++}`;
  }

  if (!element.children?.length) return;

  for (const child of [...element.children] as PageElement[]) {
    assignUniqueIdsToPageElements(child, elements);
  }
};
