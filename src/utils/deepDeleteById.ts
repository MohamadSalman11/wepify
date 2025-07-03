import type { PageElement } from '@shared/types';

export const deepDeleteById = (elements: PageElement[], targetId: string): PageElement[] => {
  return elements
    .filter((el) => el.id !== targetId)
    .map((el) => ({
      ...el,
      children: el.children ? deepDeleteById(el.children, targetId) : []
    }));
};
