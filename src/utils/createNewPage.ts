import { nanoid } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE, ID_FIRST_SECTION } from '@shared/constants';
import type { Page } from '@shared/typing';

const DEFAULT_TITLE = 'Untitled';
const ID_SECOND_SECTION = 'section-2';
const DEFAULT_PAGE_BACKGROUND_COLOR = '#343c44';

export const createNewPage = (name: string, title?: string): Page => ({
  id: nanoid(),
  name,
  title: title || DEFAULT_TITLE,
  isIndex: false,
  backgroundColor: DEFAULT_PAGE_BACKGROUND_COLOR,
  elements: {
    [ID_FIRST_SECTION]: {
      ...ELEMENTS_TEMPLATE.section,
      id: ID_FIRST_SECTION
    },
    [ID_SECOND_SECTION]: {
      ...ELEMENTS_TEMPLATE.section,
      id: ID_SECOND_SECTION
    }
  }
});
