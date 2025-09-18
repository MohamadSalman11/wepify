import { SiteMetadata } from '@shared/typing';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Icon from '../../../components/Icon';
import { DashboardPath, Path } from '../../../constant';
import SearchBox from './SearchBox';
import SitesView from './SitesView';

/**
 * Constants
 */

const EXCLUDED_SEARCH_PATHS = new Set([DashboardPath.Recent, DashboardPath.Starred, DashboardPath.Templates]);

const EMPTY_STATE_FILTERED_SITES = {
  title: 'No matching result',
  info: 'Try adjusting or clearing your filters to find sites.'
};

const TITLES = {
  [Path.Dashboard.replace('/', '')]: 'Sites',
  [DashboardPath.Recent]: 'Recent',
  [DashboardPath.Starred]: 'Starred',
  [DashboardPath.Templates]: 'Templates'
};

/**
 * Component definition
 */

export default function Main() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [filteredSites, setFilteredSites] = useState<SiteMetadata[]>([]);
  const [filterLabel, setFilterLabel] = useState<string>('');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const lastPathSegment = pathname.split('/').findLast(Boolean) ?? '';
  const hideSearchBox = isFiltering || EXCLUDED_SEARCH_PATHS.has(lastPathSegment as DashboardPath);

  const handleBackClick = () => {
    navigate(Path.Dashboard);
    setIsFiltering(false);
  };

  return (
    <Container>
      {hideSearchBox ? (
        <Icon icon={LuArrowLeft} hover onClick={handleBackClick} />
      ) : (
        <SearchBox
          setFilteredSites={setFilteredSites}
          setFilterLabel={setFilterLabel}
          setIsFiltering={setIsFiltering}
        />
      )}
      <h2>{filterLabel || TITLES[lastPathSegment]}</h2>
      {isFiltering ? <SitesView sites={filteredSites} emptyStateMessages={EMPTY_STATE_FILTERED_SITES} /> : <Outlet />}
    </Container>
  );
}

/**
 * Styles
 */

const Container = styled.main`
  padding: 2.4rem;
  flex-grow: 1;
  height: 88vh;
  margin-left: 3.2rem;
  border-radius: var(--border-radius-xl);
  background-color: var(--color-white);
  position: relative;
  overflow-y: hidden;

  h2 {
    position: sticky;
    top: 0;
    margin-top: 5.2rem;
    margin-bottom: 1.6rem;
    background-color: var(--color-white);
    padding: 1.2rem;
    width: 100%;
    font-weight: var(--font-weight-regular);
    font-size: 2rem;
  }
`;
