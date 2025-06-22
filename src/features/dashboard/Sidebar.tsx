import { nanoid } from '@reduxjs/toolkit';
import { LuClock4, LuFilePlus, LuHouse, LuStar } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { Path } from '../../constant';
import { createNewPage } from '../../helpers/createNewPage';
import type { Site } from '../../types';
import { buildPath } from '../../utils/buildPath';
import { addSite } from './slices/dashboardSlice';

/**
 * Constants
 */

const DEFAULT_NAME = 'Untitled';
const DEFAULT_DESCRIPTION = 'My modern clean site';

/**
 * Styles
 */

const StyledSidebar = styled.aside`
  width: 20rem;
  padding-top: 0.4rem;

  button {
    display: flex;
    column-gap: 1.2rem;
    justify-content: center;
    align-items: center;

    svg {
      color: var(--color-white);
    }
  }

  svg {
    color: var(--color-black-light);
    font-size: 2rem;
  }

  ul {
    margin-top: 2.4rem;

    li {
      display: flex;
      column-gap: 1.2rem;
      align-items: center;
      transition: var(--transition-base);
      cursor: pointer;
      margin-top: 1.2rem;
      border-radius: var(--border-radius-full);
      padding: 0.8rem 3.2rem;
      width: 100%;

      &:hover {
        background-color: var(--color-gray-light-2);
      }

      &:nth-child(1) {
        background-color: var(--color-primary-light-2);
      }
    }
  }
`;

/**
 * Component definition
 */

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleDesignNewSite() {
    const siteId = nanoid();
    const page = createNewPage(siteId);

    page.isIndex = true;

    const site: Site = {
      id: siteId,
      name: DEFAULT_NAME,
      description: DEFAULT_DESCRIPTION,
      pagesCount: 1,
      createdAt: Date.now(),
      lastModified: Date.now(),
      isStarred: false,
      pages: [page]
    };

    dispatch(addSite(site));
    navigate(buildPath(Path.Editor, { site: siteId, page: page.id }));
  }

  return (
    <StyledSidebar>
      <Button fullWidth={true} onClick={handleDesignNewSite}>
        <Icon icon={LuFilePlus} />
        Design New Site
      </Button>
      <ul>
        <li>
          <Icon icon={LuHouse} /> Home
        </li>
        <li>
          <Icon icon={LuClock4} /> Recent
        </li>
        <li>
          <Icon icon={LuStar} /> Stared
        </li>
      </ul>
    </StyledSidebar>
  );
}

export default Sidebar;
