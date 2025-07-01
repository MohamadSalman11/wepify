import { nanoid } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { useRef, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { LuClock4, LuFilePlus, LuHouse, LuStar, LuUpload } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { Path, TOAST_DURATION, ToastMessages } from '../../constant';
import { createNewPage } from '../../helpers/createNewPage';
import type { Site, SitePage } from '../../types';
import { buildPath } from '../../utils/buildPath';
import { setIsLoading } from '../editor/slices/editorSlice';
import { validateSiteJSON } from './helpers/validateSiteJSON';
import { addSite } from './slices/dashboardSlice';

/**
 * Constants
 */

const DEFAULT_NAME = 'Untitled';
const DEFAULT_DESCRIPTION = 'My modern clean site';
const DEFAULT_PAGES_COUNT = 1;
/**
 * Styles
 */

const StyledSidebar = styled.aside`
  width: 22rem;
  padding-top: 0.4rem;

  button {
    display: flex;
    column-gap: 1.2rem;
    justify-content: center;
    align-items: center;

    svg {
      color: var(--color-white);
    }

    &:nth-of-type(2) {
      margin-top: 1.2rem;
    }
  }

  svg {
    color: var(--color-black-light);
    font-size: 2rem;
  }
`;

const NavList = styled.ul`
  margin-top: 2.4rem;
`;

const NavItem = styled.li`
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

  &:nth-child(1) {
    background-color: var(--color-primary-light-2);
  }
`;

/**
 * Component definition
 */

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadSiteJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const text = await file.text();
      const parsedSite = JSON.parse(text);
      const siteId = nanoid();

      if (!validateSiteJSON(parsedSite)) {
        toast.error(ToastMessages.site.importInvalid, { duration: TOAST_DURATION });
        return;
      }

      delete parsedSite.__WARNING__;

      const importedSite = {
        ...parsedSite,
        id: siteId,
        pages: parsedSite.pages.map((page: SitePage) => ({
          ...page,
          id: nanoid(),
          siteId,
          elements: page.elements || []
        }))
      };

      dispatch(addSite(importedSite));
      toast.success(ToastMessages.site.imported);
    } catch {
      toast.error(ToastMessages.site.importFailed);
    }
  };

  async function handleDesignNewSite() {
    const siteId = nanoid();
    const page = createNewPage();

    page.isIndex = true;

    const site: Site = {
      id: siteId,
      name: DEFAULT_NAME,
      description: DEFAULT_DESCRIPTION,
      pagesCount: DEFAULT_PAGES_COUNT,
      createdAt: Date.now(),
      lastModified: Date.now(),
      isStarred: false,
      pages: [page]
    };

    dispatch(setIsLoading(true));

    await localforage.setItem('site', site);

    navigate(buildPath(Path.Editor, { site: siteId, page: page.id }));
  }

  return (
    <StyledSidebar>
      <input
        type='file'
        accept='.json'
        ref={fileInputRef}
        onChange={handleUploadSiteJson}
        style={{ display: 'none' }}
      />
      <Button fullWidth={true} onClick={handleDesignNewSite}>
        <Icon icon={LuFilePlus} />
        Design New Site
      </Button>
      <Button
        fullWidth={true}
        variation='secondary'
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        <Icon icon={LuUpload} />
        Import Saved Site
      </Button>
      <nav>
        <NavList>
          <NavItem>
            <Icon icon={LuHouse} /> Home
          </NavItem>
          <NavItem>
            <Icon icon={LuClock4} /> Recent
          </NavItem>
          <NavItem>
            <Icon icon={LuStar} /> Starred
          </NavItem>
        </NavList>
      </nav>
    </StyledSidebar>
  );
}

export default Sidebar;
