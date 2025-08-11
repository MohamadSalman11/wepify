import { nanoid } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE, ID_FIRST_SECTION } from '@shared/constants';
import type { PageElement, SitePage } from '@shared/typing';

const DEFAULT_NAME = 'Untitled';

export const createNewPage = (): SitePage => ({
  id: nanoid(),
  name: DEFAULT_NAME,
  title: DEFAULT_NAME,
  isIndex: false,
  elements: [{ ...ELEMENTS_TEMPLATE['section'], id: ID_FIRST_SECTION } as PageElement]
});
