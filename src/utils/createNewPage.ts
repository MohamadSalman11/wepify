import { nanoid } from '@reduxjs/toolkit';
import { DEFAULT_PAGE_BACKGROUND_COLOR, ELEMENTS_TEMPLATE, ID_FIRST_SECTION } from '@shared/constants';
import type { PageElement, SitePage } from '@shared/typing';

const DEFAULT_NAME = 'Untitled';

export const createNewPage = (): SitePage => ({
  id: nanoid(),
  name: DEFAULT_NAME,
  title: DEFAULT_NAME,
  isIndex: false,
  backgroundColor: DEFAULT_PAGE_BACKGROUND_COLOR,
  elements: [{ ...ELEMENTS_TEMPLATE.section, id: ID_FIRST_SECTION } as PageElement]
});
