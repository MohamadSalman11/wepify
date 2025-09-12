import { nanoid } from '@reduxjs/toolkit';
import type { JsType, Page, PageElement, RequiredKeys, Site } from '@shared/typing';
import { LuClock4, LuCloud, LuFileDown, LuFilePlus, LuHouse, LuLoader, LuStar } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { DashboardPath, Path, StorageKey, ToastMessages } from '../../constant';
import { useFilePicker } from '../../hooks/useFilePicker';
import { useAppSelector } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { AppToast } from '../../utils/appToast';
import { base64ToFile } from '../../utils/base64ToFile';
import { buildPath } from '../../utils/buildPath';
import { createNewPage } from '../../utils/createNewPage';
import { formatSize } from '../../utils/formatSize';
import { toSiteMetadata } from '../../utils/toSiteMetadata';
import { setLoading } from '../editor/editorSlice';
import { addSite, selectSitesArray, setProcessing } from './dashboardSlice';
import { StyledLoader } from './main/SitesView';

/**
 * Constants
 */

const DEFAULT_NAME = 'Untitled';
const DEFAULT_DESCRIPTION = 'My modern clean site';
const ACCEPTED_FILE_TYPE = '.json';

/**
 * Types
 */

const ELEMENT_SCHEMA: Record<RequiredKeys<PageElement>, JsType> = {
  id: 'string',
  tag: 'string',
  name: 'string',
  contentEditable: 'boolean',
  focusable: 'boolean',
  moveable: 'boolean',
  canHaveChildren: 'boolean',
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

/**
 * Component definition
 */

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sites = useAppSelector(selectSitesArray);
  const totalSize = formatSize(sites.reduce((acc, cur) => acc + cur.sizeKb, 0));
  const { input, openFilePicker } = useFilePicker({ accept: ACCEPTED_FILE_TYPE, onSelect: handleUploadSiteJson });

  const handleDesignNewSite = async () => {
    const siteId = nanoid();
    const page = createNewPage(DEFAULT_NAME);

    page.isIndex = true;

    const site: Site = {
      id: siteId,
      name: DEFAULT_NAME,
      description: DEFAULT_DESCRIPTION,
      createdAt: Date.now(),
      lastModified: Date.now(),
      isStarred: false,
      pages: { [page.id]: page }
    };

    dispatch(setLoading(true));
    await AppStorage.addToObject(StorageKey.Sites, siteId, site);
    navigate(buildPath(Path.Editor, { siteId, pageId: page.id }));
  };

  // Keep as function declaration to prevent "used before its declaration" error
  async function handleUploadSiteJson(file: File) {
    try {
      const icon = <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />;

      dispatch(setProcessing(true));
      AppToast.custom(ToastMessages.site.importing, { icon });

      const siteId = nanoid();
      const pagesWithNewIds: Record<string, Page> = {};
      const text = await file.text();
      const parsedSite: Site & { __WARNING__?: string; images?: Record<string, string> } = JSON.parse(text);

      for (const key in parsedSite.pages) {
        const page = parsedSite.pages[key];
        const newId = nanoid();
        pagesWithNewIds[newId] = { ...page, id: newId };
      }

      if (!validateSiteJson(parsedSite)) {
        throw new Error(ToastMessages.site.importInvalid);
      }

      const importedImages = parsedSite.images || {};
      const storedImages = (await AppStorage.get<Record<string, Blob>>(StorageKey.Images)) || {};
      const newImagesMap: Record<string, Blob> = { ...storedImages };

      for (const [oldBlobId, base64] of Object.entries(importedImages)) {
        if (!storedImages[oldBlobId]) {
          const file = await base64ToFile(base64);

          if (file) {
            newImagesMap[oldBlobId] = file;
          }
        }
      }

      await AppStorage.set(StorageKey.Images, newImagesMap);

      delete parsedSite.__WARNING__;
      delete parsedSite.images;

      const importedSite = {
        ...parsedSite,
        id: siteId,
        pages: pagesWithNewIds
      };

      dispatch({ type: addSite.type, payload: toSiteMetadata(importedSite), meta: { rawSite: importedSite } });
    } catch (error: any) {
      AppToast.error(error.message || ToastMessages.site.importFailed);
      dispatch(setProcessing(false));
    }
  }

  return (
    <StyledSidebar>
      {input}
      <Button fullWidth icon={LuFilePlus} iconColor='var(--color-white)' onClick={handleDesignNewSite}>
        Design New Site
      </Button>
      <Button variation='secondary' fullWidth icon={LuFileDown} iconColor='var(--color-white)' onClick={openFilePicker}>
        Import Saved Site
      </Button>
      <nav>
        <NavList>
          <NavItem>
            <NavLink to={Path.Dashboard} end>
              <Icon icon={LuHouse} /> Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={DashboardPath.Recent}>
              <Icon icon={LuClock4} /> Recent
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={DashboardPath.Starred}>
              <Icon icon={LuStar} /> Starred
            </NavLink>
          </NavItem>
        </NavList>
      </nav>
      <TotalSize>
        <Icon icon={LuCloud} /> Total size: {totalSize}
      </TotalSize>
    </StyledSidebar>
  );
}

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

/**
 * Styles
 */

const StyledSidebar = styled.aside`
  width: 22rem;
  padding-top: 0.4rem;

  button:nth-of-type(1) {
    margin-bottom: 1.2rem;

    svg {
      margin-left: -0.88rem;
    }
  }
`;

const NavList = styled.ul`
  margin-top: 2.4rem;
`;

const NavItem = styled.li`
  a {
    display: flex;
    column-gap: 1.2rem;
    align-items: center;
    transition: var(--transition-base);
    cursor: pointer;
    margin-top: 1.2rem;
    border-radius: var(--border-radius-full);
    padding: 0.8rem 2.4rem;
    width: 100%;

    &:hover {
      background-color: var(--color-gray-light-2);
    }

    &.active {
      background-color: var(--color-primary-light-2);
    }

    &:hover,
    &.active {
      color: var(--color-white);

      svg {
        color: currentColor !important;
      }
    }
  }
`;

const TotalSize = styled.span`
  display: flex;
  column-gap: 1.2rem;
  align-items: center;
  margin-top: 1.2rem;
  padding: 0.8rem 0 0.8rem 2.4rem;
`;
