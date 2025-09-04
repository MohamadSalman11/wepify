import { nanoid } from '@reduxjs/toolkit';
import type { Page, PageElement, RequiredKeys, Site } from '@shared/typing';
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
import { buildPath } from '../../utils/buildPath';
import { createNewPage } from '../../utils/createNewPage';
import { formatSize } from '../../utils/formatSize';
import { runWithToast } from '../../utils/runWithToast';
import { toSiteMetadata } from '../../utils/toSiteMetadata';
import { selectSitesArray } from './dashboardSlice';
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

const ELEMENT_SCHEMA: Record<RequiredKeys<PageElement>, string> = {
  id: 'string',
  tag: 'string',
  name: 'string',
  contentEditable: 'boolean',
  focusable: 'boolean',
  moveable: 'boolean',
  style: 'object'
};

const PAGE_SCHEMA: Omit<Record<keyof Page, string>, 'id'> = {
  name: 'string',
  title: 'string',
  isIndex: 'boolean',
  elements: 'array',
  backgroundColor: 'string'
};

const SITE_SCHEMA: Omit<Record<keyof Site, string>, 'id'> = {
  name: 'string',
  description: 'string',
  pages: 'array',
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

    AppToast.dismiss();

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

    // dispatch(setIsLoading(true));
    await AppStorage.updateObject(StorageKey.Sites, { [siteId]: site });
    navigate(buildPath(Path.Editor, { siteId, pageId: page.id }));
  };

  // Keep as function declaration to prevent "used before its declaration" error
  async function handleUploadSiteJson(file: File) {
    runWithToast({
      startMessage: ToastMessages.site.importing,
      successMessage: ToastMessages.site.imported,
      errorMessage: ToastMessages.site.importFailed,
      icon: <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />,
      onExecute: async () => {
        // dispatch(setIsProcessing(true));

        const text = await file.text();
        const parsedSite: Site & { __WARNING__?: string } = JSON.parse(text);

        if (!validateSiteJson(parsedSite)) {
          throw new Error(ToastMessages.site.importInvalid);
        }

        delete parsedSite.__WARNING__;

        const importedSite = {
          ...parsedSite,
          id: nanoid(),
          pages: parsedSite.pages.map((page: Page) => ({ ...page, id: nanoid() }))
        };

        dispatch(addSite(toSiteMetadata(importedSite)));

        return importedSite;
      },
      onFinally: () => dispatch(setIsProcessing(false))
    });
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

  if ('children' in el) {
    if (!Array.isArray(el.children)) return false;
    return el.children.every((child) => isValidElement(child));
  }

  return true;
};

const validateSiteJson = (site: Site): boolean =>
  validate(site, SITE_SCHEMA) &&
  Array.isArray(site.pages) &&
  site.pages.every(
    (page: Page) =>
      validate(page, PAGE_SCHEMA) && Array.isArray(page.elements) && page.elements.every((el) => isValidElement(el))
  );

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
