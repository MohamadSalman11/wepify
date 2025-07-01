import localforage from 'localforage';
import type { PageElement, Site } from '../../../types';
import { findElementById } from '../../../utils/findElementById';

export const saveElementInStorage = async (
  pageId: string | undefined,
  elementId: string,
  fn: (element: PageElement) => void
) => {
  const site = await localforage.getItem<Site>('site');
  const page = site?.pages.find((p) => p.id === pageId);

  if (!site || !page) return;

  const element = findElementById(elementId, page.elements);

  if (element) {
    fn(element);
  }

  await localforage.setItem('site', site);
};
