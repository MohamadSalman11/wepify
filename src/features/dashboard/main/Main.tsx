import { Site, SiteMetadata } from '@shared/typing';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { DashboardPath, StorageKey } from '../../../constant';
import { useLoadFromStorage } from '../../../hooks/useLoadFromStorage';
import { useAppSelector } from '../../../store';
import { AppStorage } from '../../../utils/appStorage';
import { toSiteMetadata } from '../../../utils/toSiteMetadata';
import { updateInSitesStorage } from '../../../utils/updateSitesInStorage';
import { setIsLoading, setSites } from '../slices/dashboardSlice';
import SearchBox from './SearchBox';

/**
 * Constants
 */

const SEARCHBOX_EXCLUDE_PATHS = new Set([DashboardPath.Recent, DashboardPath.Starred]);

/**
 * Types
 */

type StorageData = {
  site: Site | null;
  sitesMetadata: SiteMetadata[] | null;
} | null;

/**
 * Component definition
 */

export default function Main() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { sitesMetadata, filters } = useAppSelector((state) => state.dashboard);
  const hasActiveFilters = Object.keys(filters).length > 0;
  const lastPathSegment = pathname.split('/').findLast((segment) => segment.length > 0) ?? '';
  const hideSearch = SEARCHBOX_EXCLUDE_PATHS.has(lastPathSegment as DashboardPath);
  const storageKey = useMemo(() => [StorageKey.SitesMetaData, StorageKey.Site], []) as StorageKey[];

  const onLoaded = useCallback(
    async (data: StorageData) => {
      if (!data) {
        return dispatch(setIsLoading(false));
      }

      const { sitesMetadata, site } = data;
      const sitesMetadataCopy = sitesMetadata ?? [];

      if (site) {
        await updateInSitesStorage((sites) => {
          const siteMetadata = toSiteMetadata(site);
          const siteMetadataIndex = sitesMetadataCopy.findIndex((s) => s.id === site.id);
          const isSiteMetadataExist = siteMetadataIndex !== -1;
          const siteIndex = sites.findIndex((s: Site) => s.id === site.id);
          const isSiteExist = siteIndex !== -1;

          if (isSiteMetadataExist) {
            sitesMetadataCopy[siteMetadataIndex] = siteMetadata;
          } else {
            sitesMetadataCopy.push(siteMetadata);
          }

          return isSiteExist ? [...sites.slice(0, siteIndex), site, ...sites.slice(siteIndex + 1)] : [...sites, site];
        });
      }

      await AppStorage.removeItem(StorageKey.Site);
      dispatch(setSites(sitesMetadataCopy));
      dispatch(setIsLoading(false));
    },
    [dispatch]
  );

  useLoadFromStorage<StorageData>({
    storageKey,
    onLoaded
  });

  useEffect(() => {
    AppStorage.setItem(StorageKey.SitesMetaData, sitesMetadata);
  }, [sitesMetadata]);

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
