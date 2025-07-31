import type { InputChangeEvent, Site } from '@shared/typing';
import { useRef, useState, type ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { LuCalendar, LuChevronDown, LuFileStack, LuHardDrive, LuLayoutTemplate, LuSearch, LuX } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import { Path, StorageKey } from '../../../constant';
import { useAppSelector } from '../../../store';
import { AppStorage } from '../../../utils/appStorage';
import { buildPath } from '../../../utils/buildPath';
import { formatDate } from '../../../utils/formatDate';
import { setFilterLabel, setFilters, type FilterCriteria } from '../slices/dashboardSlice';

/**
 * Constants
 */

const OPTIONS_SIZE = [
  { label: '< 500 KB', min: 0, max: 500 },
  { label: '500 KB - 1 MB', min: 500, max: 1024 },
  { label: '1 MB - 5 MB', min: 1024, max: 5120 },
  { label: '5 MB - 10 MB', min: 5120, max: 10_240 },
  { label: '> 10 MB', min: 10_240, max: Infinity }
];

const OPTIONS_PAGE = [
  { label: '1 - 3 pages', min: 1, max: 3 },
  { label: '4 - 10 pages', min: 4, max: 10 },
  { label: '11 - 25 pages', min: 11, max: 25 },
  { label: '26 - 50 pages', min: 26, max: 50 },
  { label: '> 50 pages', min: 51, max: Infinity }
];

const OPTIONS_MODIFIED = [
  { label: 'Today', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Last 90 days', days: 90 }
];

/**
 * Component definition
 */

export default function SearchBox() {
  const sites = useAppSelector((state) => state.dashboard.sites);
  const [matchedSites, setMatchedSites] = useState<Site[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearchResultVisible = isSearching;

  const handleSearch = (event: InputChangeEvent) => {
    const search = event.target.value.toLowerCase();
    const matchSites = search
      ? sites.filter(
          (site) => site.name.toLowerCase().includes(search) || site.description.toLowerCase().includes(search)
        )
      : [];

    setMatchedSites(matchSites);
    setIsSearching(!!search);
  };

  const clearSearch = () => {
    if (inputRef.current) inputRef.current.value = '';
    setMatchedSites([]);
    setIsSearching(false);
  };

  return (
    <StyledSearchBox>
      <h1>Welcome to Wepify</h1>
      <Searchbar $isSearchResult={isSearchResultVisible}>
        <Icon icon={LuSearch} />
        <Input
          size='lg'
          pill={true}
          ref={inputRef}
          type='text'
          placeholder='Search in Wepify'
          onChange={handleSearch}
        />
        {isSearching && <Icon icon={LuX} onClick={clearSearch} />}
      </Searchbar>
      {isSearchResultVisible && <SearchResults matchedSites={matchedSites} />}
      <FilterList />
    </StyledSearchBox>
  );
}

function SearchResults({ matchedSites }: { matchedSites: Site[] }) {
  const navigate = useNavigate();
  const isNoResult = matchedSites.length === 0;

  const handleOpenEditor = async (site: Site) => {
    await AppStorage.setItem(StorageKey.Site, site);
    navigate(buildPath(Path.Editor, { siteId: site.id, pageId: site.pages[0].id }));
  };

  return (
    <StyledSearchContainer>
      {isNoResult ? (
        <NoResultsText>No items match your search</NoResultsText>
      ) : (
        <SearchResultList>
          {matchedSites.map((site) => (
            <SearchResultItem key={site.id} onClick={() => handleOpenEditor(site)}>
              <ItemContent>
                <Icon icon={LuLayoutTemplate} />
                <div>
                  <span>{site.name}</span>
                  <p>{site.description}</p>
                </div>
              </ItemContent>
              <span>{formatDate(site.createdAt)}</span>
            </SearchResultItem>
          ))}
        </SearchResultList>
      )}
    </StyledSearchContainer>
  );
}

function FilterList() {
  const dispatch = useDispatch();

  const handleFilter = (filter: Partial<FilterCriteria>, label: string) => {
    dispatch(setFilters(filter));
    dispatch(setFilterLabel(label));
  };

  return (
    <FilterToolbar>
      <FilterItem title='Size' icon={LuHardDrive}>
        {OPTIONS_SIZE.map(({ label, min, max }) => (
          <li key={label} onClick={() => handleFilter({ sizeRange: { min, max } }, label)}>
            {label}
          </li>
        ))}
      </FilterItem>
      <FilterItem title='Pages' icon={LuFileStack}>
        {OPTIONS_PAGE.map(({ label, min, max }) => (
          <li key={label} onClick={() => handleFilter({ pageRange: { min, max } }, label)}>
            {label}
          </li>
        ))}
      </FilterItem>
      <FilterItem title='Modified' icon={LuCalendar}>
        {OPTIONS_MODIFIED.map(({ label, days }) => (
          <li key={label} onClick={() => handleFilter({ modifiedWithinDays: days }, label)}>
            {label}
          </li>
        ))}
      </FilterItem>
    </FilterToolbar>
  );
}

function FilterItem({ children, title, icon }: { children: ReactNode; title: string; icon: IconType }) {
  return (
    <li>
      <Dropdown>
        <Dropdown.Open>
          <FilterButton>
            <Icon icon={icon} />
            {title}
            <Icon icon={LuChevronDown} />
          </FilterButton>
        </Dropdown.Open>
        <Dropdown.Drop>{children}</Dropdown.Drop>
      </Dropdown>
    </li>
  );
}

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
    font-size: 2rem;
  }
`;

const FilterToolbar = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 2.4rem;
  margin-top: 1.6rem;

  & > li {
    position: relative;
  }
`;

const FilterButton = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.8rem;
  transition: var(--transition-base);
  cursor: pointer;
  border-radius: var(--border-radius-full);
  background-color: var(--color-gray-light-4);
  padding: 0.8rem 1.2rem;
  font-size: 1.2rem;

  &:hover {
    background-color: var(--color-gray-light-3);
  }

  svg:nth-child(1) {
    font-size: 1.8rem;
  }
`;

const Searchbar = styled.div<{ $isSearchResult: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 2.4rem;

  input {
    border-radius: ${({ $isSearchResult }) =>
      $isSearchResult ? 'var(--border-radius-xxl)' : 'var(--border-radius-full)'};

    ${({ $isSearchResult }) =>
      $isSearchResult &&
      css`
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      `};

    width: 80rem;
  }

  svg {
    position: absolute;
    font-size: 2rem;

    &:first-child {
      left: 3%;
    }

    &:last-child {
      right: 3%;
    }
  }
`;

const StyledSearchContainer = styled.ul`
  position: absolute;
  top: 10rem;
  left: 0;
  width: 100%;
  max-height: 40rem;
  background-color: var(--color-white-2);
  z-index: var(--zindex-base);
  padding: 1.2rem;
  border-radius: var(--border-radius-xxl);
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid var(--color-gray-light-2);
  overflow-y: auto;
`;

const NoResultsText = styled.p`
  margin: 1.6rem;
  color: var(--color-gray);
`;

const SearchResultList = styled.ul`
  display: flex;
  row-gap: 1.2rem;
  flex-direction: column;
  width: 100%;
`;

const SearchResultItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition-base);
  cursor: pointer;
  border-radius: var(--border-radius-xl);
  color: var(--color-gray);
  padding: 1.2rem;

  &:hover {
    box-shadow: var(--box-shadow-2);
    background-color: var(--color-gray-light-4);
  }
`;

const ItemContent = styled.div`
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
`;
