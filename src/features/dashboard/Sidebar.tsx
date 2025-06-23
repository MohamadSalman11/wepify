import { nanoid } from '@reduxjs/toolkit';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { LuClock4, LuFilePlus, LuHouse, LuStar, LuUpload } from 'react-icons/lu';
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
      padding: 0.8rem 2.6rem;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadSiteJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const parsedSite = JSON.parse(text);

      if (!parsedSite.pages || !Array.isArray(parsedSite.pages)) {
        toast.error('Invalid site.json: Missing or malformed "pages".');
        return;
      }

      const siteId = nanoid();

      const newSite = {
        ...parsedSite,
        id: siteId,
        pages: parsedSite.pages.map((page) => ({
          ...page,
          id: nanoid(),
          siteId,
          elements: page.elements || []
        }))
      };

      dispatch(addSite(newSite));
      toast.success('Site imported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to import site.json.');
    }
  };

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
