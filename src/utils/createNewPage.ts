import { nanoid } from '@reduxjs/toolkit';
import { DEFAULT_PAGE_BACKGROUND_COLOR, ELEMENTS_TEMPLATE, ID_FIRST_SECTION } from '@shared/constants';
import type { PageElement, SitePage } from '@shared/typing';

const DEFAULT_TITLE = 'Untitled';

export const createNewPage = (name: string, title?: string): SitePage => ({
  id: nanoid(),
  name,
  title: title || DEFAULT_TITLE,
  isIndex: false,
  backgroundColor: DEFAULT_PAGE_BACKGROUND_COLOR,
  elements: [{ ...ELEMENTS_TEMPLATE.section, id: ID_FIRST_SECTION } as PageElement]
});
