import { nanoid } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE } from '../constant';
import type { SitePage } from '../types';

const DEFAULT_NAME = 'Untitled';
const DEFAULT_DESCRIPTION = 'My modern clean site';

export const createNewPage = (siteId: string): SitePage => ({
  id: nanoid(),
  siteId,
  name: DEFAULT_NAME,
  title: DEFAULT_NAME,
  siteName: DEFAULT_NAME,
  siteDescription: DEFAULT_DESCRIPTION,
  isIndex: false,
  elements: [{ ...ELEMENTS_TEMPLATE['section'], id: 'section-1' }]
});
