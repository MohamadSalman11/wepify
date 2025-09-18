import { nanoid } from '@reduxjs/toolkit';
import { JsType, Page, PageElement, RequiredKeys, Site } from '@shared/typing';
import { StorageKey, ToastMessages } from '../constant';
import { AppStorage } from '../utils/appStorage';
import { AppToast } from '../utils/appToast';
import { base64ToFile } from '../utils/base64ToFile';

const ELEMENT_SCHEMA: Record<RequiredKeys<PageElement>, JsType> = {
  id: 'string',
  tag: 'string',
  name: 'string',
  contentEditable: 'boolean',
  focusable: 'boolean',
  moveable: 'boolean',
  canHaveChildren: 'boolean',
  domIndex: 'number',
  style: 'object'
};

const ELEMENT_SCHEMA_OPTIONAL: Partial<Record<keyof PageElement, JsType>> = {
  parentId: 'string',
  content: 'string',
  attrs: 'object',
  responsive: 'object'
};

const PAGE_SCHEMA: Omit<Record<keyof Page, JsType>, 'id'> = {
  name: 'string',
  title: 'string',
  isIndex: 'boolean',
  elements: 'object',
  backgroundColor: 'string'
};

const SITE_SCHEMA: Omit<Record<keyof Site, JsType>, 'id'> = {
  name: 'string',
  description: 'string',
  pages: 'object',
  createdAt: 'number',
  lastModified: 'number',
  isStarred: 'boolean'
};

export const importSiteFromJson = async (file: File) => {
  try {
    const siteId = nanoid();
    const text = await file.text();
    const parsedSite: Site & { __WARNING__?: string; images?: Record<string, string> } = JSON.parse(text);

    if (!validateSiteJson(parsedSite)) {
      throw new Error(ToastMessages.site.importInvalid);
    }

    const storedImages = (await AppStorage.get<Record<string, Blob>>(StorageKey.Images)) || {};
    const newImagesMap = await maybeMergeImportedImages(parsedSite.images || {}, storedImages);

    await AppStorage.set(StorageKey.Images, newImagesMap);

    delete parsedSite.__WARNING__;
    delete parsedSite.images;

    const importedSite: Site = {
      ...parsedSite,
      id: siteId,
      pages: parsedSite.pages
    };

    return importedSite;
  } catch (error: any) {
    AppToast.error(error.message || ToastMessages.site.importFailed);
  }
};

const maybeMergeImportedImages = async (
  importedImages: Record<string, string>,
  storedImages: Record<string, Blob>
): Promise<Record<string, Blob>> => {
  const newImagesMap: Record<string, Blob> = { ...storedImages };

  for (const [oldBlobId, base64] of Object.entries(importedImages)) {
    if (!storedImages[oldBlobId]) {
      const file = await base64ToFile(base64);

      if (file) {
        newImagesMap[oldBlobId] = file;
      }
    }
  }

  return newImagesMap;
};

const validate = (obj: Site | Page | PageElement, schema: Record<string, string>): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;

  return Object.entries(schema).every(([key, type]) => {
    const val = obj[key as keyof typeof obj];
    if (type === 'array') return Array.isArray(val);
    return typeof val === type && val !== null;
  });
};

const isValidElement = (el: PageElement): boolean => {
  if (!validate(el, ELEMENT_SCHEMA)) return false;

  for (const [key, type] of Object.entries(ELEMENT_SCHEMA_OPTIONAL)) {
    if (key in el && typeof el[key as keyof PageElement] !== type) return false;
  }

  return true;
};

const validateSiteJson = (site: Site): boolean => {
  if (!validate(site, SITE_SCHEMA)) return false;

  for (const pageId in site.pages) {
    const page = site.pages[pageId];
    if (!validate(page, PAGE_SCHEMA)) return false;

    for (const elId in page.elements) {
      const el = page.elements[elId];
      if (!isValidElement(el)) return false;
    }
  }

  return true;
};
