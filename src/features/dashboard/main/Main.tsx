import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { DashboardPath } from '../../../constant';
import { useAppSelector } from '../../../store';
import SearchBox from './SearchBox';

/**
 * Constants
 */

const SEARCHBOX_EXCLUDE_PATHS = new Set([DashboardPath.Recent, DashboardPath.starred]);

/**
 * Component definition
 */

export default function Main() {
  const { filters } = useAppSelector((state) => state.dashboard);
  const { pathname } = useLocation();
  const hasActiveFilters = Object.keys(filters).length > 0;
  const lastPathSegment = pathname.split('/').findLast((segment) => segment.length > 0) ?? '';
  const hideSearch = SEARCHBOX_EXCLUDE_PATHS.has(lastPathSegment as DashboardPath);

  return (
    <StyledMain>
      {hasActiveFilters || hideSearch || <SearchBox />}
      <Outlet />
    </StyledMain>
  );
}

/**
 * Styles
 */

const StyledMain = styled.main`
  padding: 2.4rem;
  flex-grow: 1;
  height: 88vh;
  margin-left: 3.2rem;
  border-radius: var(--border-radius-xl);
  background-color: var(--color-white);
  position: relative;
  overflow-y: hidden;
`;
