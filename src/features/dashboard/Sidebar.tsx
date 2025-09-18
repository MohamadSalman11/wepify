import { nanoid } from '@reduxjs/toolkit';
import type { Site } from '@shared/typing';
import { LuClock4, LuCloud, LuFileDown, LuFilePlus, LuHouse, LuLayoutTemplate, LuLoader, LuStar } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { DashboardPath, Path, ToastMessages } from '../../constant';
import { useFilePicker } from '../../hooks/useFilePicker';
import { useAppSelector } from '../../store';
import { AppToast } from '../../utils/appToast';
import { buildPath } from '../../utils/buildPath';
import { createNewPage } from '../../utils/createNewPage';
import { formatSize } from '../../utils/formatSize';
import { importSiteFromJson } from '../../utils/importSiteFromJson';
import { toSiteMetadata } from '../../utils/toSiteMetadata';
import { addSite, selectSitesArray, setProcessing } from './dashboardSlice';
import { StyledLoader } from './main/SitesView';

/**
 * Constants
 */

const DEFAULT_NAME = 'Untitled';
const DEFAULT_DESCRIPTION = 'My modern clean site';
const ACCEPTED_FILE_TYPE = '.json';

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

    navigate(buildPath(Path.Editor, { siteId, pageId: page.id }), { state: { site } });
  };

  // Keep as function declaration to prevent "used before its declaration" error
  async function handleUploadSiteJson(file: File) {
    const icon = <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />;

    dispatch(setProcessing(true));
    AppToast.custom(ToastMessages.site.importing, { icon });

    const site = await importSiteFromJson(file);

    if (site) {
      dispatch({ type: addSite.type, payload: toSiteMetadata(site), meta: { rawSite: site } });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      AppToast.success(ToastMessages.site.imported);
    }

    dispatch(setProcessing(false));
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
          <NavItem>
            <NavLink to={DashboardPath.Templates}>
              <Icon icon={LuLayoutTemplate} /> Templates
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
