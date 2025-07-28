import { nanoid } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE } from '@shared/constants';
import type { SitePage } from '@shared/types';

const DEFAULT_NAME = 'Untitled';
const FIRST_SECTION_ID = 'section-1';

export const createNewPage = (): SitePage => ({
  id: nanoid(),
  name: DEFAULT_NAME,
  title: DEFAULT_NAME,
  isIndex: false,
  elements: [{ ...ELEMENTS_TEMPLATE['section'], id: FIRST_SECTION_ID }]
});
