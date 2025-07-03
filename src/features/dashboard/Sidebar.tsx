import { nanoid } from '@reduxjs/toolkit';
import type { Site, SitePage } from '@shared/types';
import toast from 'react-hot-toast';
import { LuClock4, LuFilePlus, LuHouse, LuStar } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { Path, StorageKey, TOAST_DURATION, ToastMessages } from '../../constant';
import { useFilePicker } from '../../hooks/useFilePicker';
import { AppStorage } from '../../utils/appStorage';
import { buildPath } from '../../utils/buildPath';
import { createNewPage } from '../../utils/createNewPage';
import { validateSiteJson } from '../../utils/validateSiteJson';
import { setIsLoading } from '../editor/slices/editorSlice';
import { addSite } from './slices/dashboardSlice';

/**
 * Constants
 */

const DEFAULT_NAME = 'Untitled';
const DEFAULT_DESCRIPTION = 'My modern clean site';
const DEFAULT_PAGES_COUNT = 1;

/**
 * Component definition
 */

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { input, openFilePicker } = useFilePicker({ accept: '.json', onSelect: handleUploadSiteJson });

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
      <Button fullWidth icon={LuFilePlus} onClick={handleDesignNewSite}>
        Design New Site
      </Button>
      <Button variation='secondary' fullWidth icon={LuFilePlus} onClick={openFilePicker}>
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

/**
 * Styles
 */

const StyledSidebar = styled.aside`
  width: 22rem;
  padding-top: 0.4rem;

  button:nth-of-type(1) {
    margin-bottom: 1.2rem;
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

  svg {
    color: var(--color-black-light-2);
  }
`;
