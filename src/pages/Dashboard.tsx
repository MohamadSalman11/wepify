import { Site, SiteMetadata } from '@shared/typing';
import { useCallback, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import LoadingScreen from '../components/LoadingScreen';
import { StorageKey } from '../constant';
import Header from '../features/dashboard/Header';
import Main from '../features/dashboard/main/Main';
import Sidebar from '../features/dashboard/Sidebar';
import { setIsLoading, setSites } from '../features/dashboard/slices/dashboardSlice';
import { useLoadFromStorage } from '../hooks/useLoadFromStorage';
import { useAppSelector } from '../store';
import { AppStorage } from '../utils/appStorage';
import { toSiteMetadata } from '../utils/toSiteMetadata';
import { updateInSitesStorage } from '../utils/updateSitesInStorage';

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

export default function Dashboard() {
  const dispatch = useDispatch();
  const { sitesMetadata, isLoading, isProcessing } = useAppSelector((state) => state.dashboard);
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

  if (isLoading) {
    return (
      <>
        <title>{'Loading Sites... - Wepify Dashboard'}</title>
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <Toaster position='top-center' />
      <StyledDashboard $isProcessing={isProcessing}>
        <title>Wepify Dashboard — Manage Your Websites</title>
        <Header />
        <DashboardLayout>
          <Sidebar />
          <Main />
        </DashboardLayout>
      </StyledDashboard>
    </>
  );
}

/**
 * Styles
 */

const StyledDashboard = styled.div<{ $isProcessing: boolean }>`
  padding: 1.2rem 2.4rem;
  user-select: none;
  font-weight: var(--font-weight-medium);

  ${(props) =>
    props.$isProcessing &&
    css`
      opacity: 0.8;
      filter: blur(2px);
      pointer-events: none;
    `}

  & > div:nth-of-type(2) {
    margin-top: 1.2rem;
  }
`;

const DashboardLayout = styled.div`
  display: flex;
  margin-top: 0.8rem;
`;
