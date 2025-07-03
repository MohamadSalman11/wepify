import type { PageElement, Site, SitePage } from '@shared/types';

const SITE_SCHEMA = {
  name: 'string',
  description: 'string',
  pagesCount: 'number',
  pages: 'array',
  createdAt: 'number',
  lastModified: 'number',
  isStarred: 'boolean'
};

const PAGE_SCHEMA = {
  name: 'string',
  title: 'string',
  isIndex: 'boolean',
  elements: 'array'
};

const ELEMENT_SCHEMA = {
  id: 'string',
  tag: 'string'
};

const validate = (obj: Site | SitePage | PageElement, schema: Record<string, string>): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;

  return Object.entries(schema).every(([key, type]) => {
    const val = obj[key as keyof typeof obj];

    if (type === 'array') return Array.isArray(val);
    return typeof val === type && val !== null;
  });
};

export const validateSiteJson = (site: Site): boolean =>
  validate(site, SITE_SCHEMA) &&
  Array.isArray(site.pages) &&
  site.pages.every(
    (page: SitePage) =>
      validate(page, PAGE_SCHEMA) &&
      Array.isArray(page.elements) &&
      page.elements.every((el) => validate(el, ELEMENT_SCHEMA))
  );
