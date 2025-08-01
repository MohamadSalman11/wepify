import { nanoid } from '@reduxjs/toolkit';
import type { PageElement, Site, SitePage } from '@shared/typing';
import toast from 'react-hot-toast';
import { LuClock4, LuCloud, LuFileDown, LuFilePlus, LuHouse, LuStar } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { DashboardPath, Path, StorageKey, TOAST_DURATION, ToastMessages } from '../../constant';
import { useFilePicker } from '../../hooks/useFilePicker';
import { useAppSelector } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { buildPath } from '../../utils/buildPath';
import { calculateSiteSize } from '../../utils/calculateSiteSize';
import { createNewPage } from '../../utils/createNewPage';
import { setIsLoading } from '../editor/slices/editorSlice';
import { addSite } from './slices/dashboardSlice';

/**
 * Constants
 */

const DEFAULT_NAME = 'Untitled';
const DEFAULT_DESCRIPTION = 'My modern clean site';
const ACCEPTED_FILE_TYPE = '.json';

const SITE_SCHEMA = {
  name: 'string',
  description: 'string',
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

/**
 * Component definition
 */

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sites = useAppSelector((state) => state.dashboard.sites);
  const { input, openFilePicker } = useFilePicker({ accept: ACCEPTED_FILE_TYPE, onSelect: handleUploadSiteJson });

  async function handleDesignNewSite() {
    const siteId = nanoid();
    const page = createNewPage();

    page.isIndex = true;

    const site: Site = {
      id: siteId,
      name: DEFAULT_NAME,
      description: DEFAULT_DESCRIPTION,
      createdAt: Date.now(),
      lastModified: Date.now(),
      isStarred: false,
      pages: [page]
    };

    dispatch(setIsLoading(true));
    await AppStorage.setItem(StorageKey.Site, site);
    navigate(buildPath(Path.Editor, { siteId, pageId: page.id }));
  }

  async function handleUploadSiteJson(file: File) {
    try {
      const text = await file.text();
      const parsedSite: Site & { __WARNING__?: string } = JSON.parse(text);

      if (!validateSiteJson(parsedSite)) {
        toast.error(ToastMessages.site.importInvalid, { duration: TOAST_DURATION });
        return;
      }

      delete parsedSite.__WARNING__;

      const importedSite = {
        ...parsedSite,
        id: nanoid(),
        pages: parsedSite.pages.map((page: SitePage) => ({ ...page, id: nanoid() }))
      };

      dispatch(addSite(importedSite));
      toast.success(ToastMessages.site.imported);
    } catch {
      toast.error(ToastMessages.site.importFailed);
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
        <Icon icon={LuCloud} /> Total size: {sites.length > 0 ? calculateSiteSize(sites) : '0 KB'}
      </TotalSize>
    </StyledSidebar>
  );
}

const validate = (obj: Site | SitePage | PageElement, schema: Record<string, string>): boolean => {
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
    (page: SitePage) =>
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
