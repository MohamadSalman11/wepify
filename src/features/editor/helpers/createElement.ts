import { ELEMENTS_TEMPLATE } from '../../../constant';
import type { PageElement } from '../../../types';
import { flattenElements } from '../../../utils/flattenElements';

export const createNewElement = (
  elementName: keyof typeof ELEMENTS_TEMPLATE,
  pageElements: PageElement[],
  selectionChildren: PageElement[] = [],
  additionalProps?: Record<string, any>
) => {
  const element = { ...ELEMENTS_TEMPLATE[elementName], ...additionalProps };
  const tagCount = flattenElements(pageElements).filter((el) => el.name === element.name).length;
  const newId = `${element.name}-${tagCount + 1}`;
  const newElement = { ...element, id: newId };
  const children = [...selectionChildren, newElement];

  return { newElement, children };
};
