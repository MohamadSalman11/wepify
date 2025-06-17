import { useRef, useState, type ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { LuCalendar, LuChevronDown, LuFileStack, LuHardDrive, LuLayoutTemplate, LuSearch, LuX } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Dropdown from '../../../components/Dropdown';
import Icon from '../../../components/Icon';
import { Path } from '../../../constant';
import { useAppSelector } from '../../../store';
import type { InputChangeEvent, Site } from '../../../types';
import { buildPath } from '../../../utils/buildPath';
import { formatDate } from '../../../utils/formatDate';

/**
 * Styles
 */

const StyledSearchBox = styled.div`
  margin: 1.2rem auto;
  width: fit-content;
  text-align: center;
  position: relative;

  h1 {
    font-weight: 400;
    font-size: 2.2rem;
  }

  & > ul {
    display: flex;
    column-gap: 2.4rem;
    justify-content: center;
    align-items: center;
    margin-top: 1.6rem;

    & > li {
      position: relative;

      & > span {
        display: flex;
        column-gap: 0.8rem;
        justify-content: center;
        align-items: center;
        transition: var(--transition-base);
        cursor: pointer;
        border-radius: var(--border-radius-full);
        background-color: var(--color-gray-light-3);
        padding: 0.8rem 1.2rem;
        font-size: 1.2rem;

        &:hover {
          background-color: var(--color-gray-light-2);
        }

        svg:nth-child(1) {
          font-size: 1.8rem;
        }
      }
    }
  }
`;

const Searchbar = styled.div<{ isSearchResult: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 2.4rem;

  input {
    border-radius: ${({ isSearchResult }) =>
      isSearchResult ? 'var(--border-radius-xxl)' : 'var(--border-radius-full)'};

    ${({ isSearchResult }) =>
      isSearchResult &&
      css`
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      `};

    outline: none;
    background-color: var(--color-white-2);
    padding: 1.6rem 1.6rem 1.6rem 6.4rem;
    width: 80rem;
    font-size: 1.6rem;
  }

  svg {
    position: absolute;
    font-size: 2rem;
  }

  svg.search-icon {
    left: 3%;
  }

  svg.clear-icon {
    right: 2%;
    cursor: pointer;
  }
`;

const StyledSearchContainer = styled.ul`
  position: absolute;
  top: 8.5rem;
  left: 0;
  width: 100%;
  max-height: 40rem;
  background-color: var(--color-white-2);
  z-index: 999;
  padding: 1.2rem;
  border-radius: var(--border-radius-xxl);
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid var(--color-gray-light-2);
  overflow-y: auto;

  & > p {
    margin: 1.6rem;
  }

  ul {
    display: flex;
    row-gap: 1.2rem;
    flex-direction: column;
    width: 100%;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: var(--transition-base);
    cursor: pointer;
    border-radius: var(--border-radius-xl);

    padding: 1.2rem;

    &:hover {
      background-color: var(--color-gray-light);
    }

    & > div {
      display: flex;
      column-gap: 1.2rem;
      align-items: center;

      & div {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        span {
          width: fit-content;
        }
      }
    }
  }
`;

/**
 * Component definition
 */

export default function SearchBox() {
  const { sites } = useAppSelector((state) => state.dashboard);
  const [matchedSites, setMatchedSites] = useState<Site[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(event: InputChangeEvent) {
    const search = event.target.value.toLowerCase();
    const matchSites = search
      ? sites.filter(
          (site) => site.name.toLowerCase().includes(search) || site.description.toLowerCase().includes(search)
        )
      : [];

    setMatchedSites(matchSites);
    setIsSearching(!!search);
  }

  function clearSearch() {
    if (inputRef.current) inputRef.current.value = '';
    setMatchedSites([]);
    setIsSearching(false);
  }

  const isSearchResultVisible = isSearching;

  return (
    <StyledSearchBox>
      <h1>Welcome to Wepify</h1>
      <Searchbar isSearchResult={isSearchResultVisible}>
        <LuSearch className='search-icon' />
        <input ref={inputRef} type='text' placeholder='Search in Wepify' onChange={handleSearch} />
        {isSearching && <LuX className='clear-icon' onClick={clearSearch} />}
      </Searchbar>
      {isSearchResultVisible && <SearchResults matchedSites={matchedSites} />}
      <FilterList />
    </StyledSearchBox>
  );
}

function SearchResults({ matchedSites }: { matchedSites: Site[] }) {
  const navigate = useNavigate();
  const isNoResult = matchedSites.length === 0;

  return (
    <StyledSearchContainer>
      {isNoResult ? (
        <p>No items match your search</p>
      ) : (
        <ul>
          {matchedSites.map((site) => (
            <>
              <li
                key={site.id}
                onClick={() => navigate(buildPath(Path.Editor, { site: site.id, page: site.pages[0].id }))}
              >
                <div>
                  <Icon icon={LuLayoutTemplate} />
                  <div>
                    <span>{site.name}</span>
                    <p>{site.description}</p>
                  </div>
                </div>
                <span>{formatDate(site.createdAt)}</span>
              </li>
            </>
          ))}
        </ul>
      )}
    </StyledSearchContainer>
  );
}

function FilterList() {
  return (
    <ul>
      <FilterItem title='Size' icon={LuHardDrive}>
        <li>{'<'} 500 KB</li>
        <li>500 KB - 1 MB</li>
        <li>1 MB - 5 MB</li>
        <li>5 MB - 10 MB</li>
        <li>{'>'} 10 MB</li>
      </FilterItem>
      <FilterItem title='Pages' icon={LuFileStack}>
        <li>1 - 3 pages</li>
        <li>4 - 10 pages</li>
        <li>11 - 25 pages</li>
        <li>26 - 50 pages</li>
        <li>{'>'} 50 pages</li>
      </FilterItem>
      <FilterItem title='Modified' icon={LuCalendar}>
        <li>Today</li>
        <li>Last 7 days</li>
        <li>Last 30 days</li>
        <li>Last 60 days</li>
        <li>Last 90 days</li>
      </FilterItem>
    </ul>
  );
}

function FilterItem({ children, title, icon }: { children: ReactNode; title: string; icon: IconType }) {
  return (
    <li>
      <Dropdown>
        <Dropdown.open>
          <span>
            <Icon icon={icon} />
            {title}
            <LuChevronDown />
          </span>
        </Dropdown.open>
        <Dropdown.drop>{children}</Dropdown.drop>
      </Dropdown>
    </li>
  );
}
