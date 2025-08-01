import type { Site } from '@shared/typing';
import { useCallback, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import LoadingScreen from '../components/LoadingScreen';
import { StorageKey } from '../constant';
import Header from '../features/dashboard/Header';
import Main from '../features/dashboard/main/Main';
import Sidebar from '../features/dashboard/Sidebar';
import { setIsLoading, setSites } from '../features/dashboard/slices/dashboardSlice';
import { useLoadFromStorage } from '../hooks/useLoadFromStorage';
import { useAppSelector } from '../store';
import { AppStorage } from '../utils/appStorage';
import { getRandomDuration } from '../utils/getRandomDuration';

/**
 * Constants
 */

const loadingDuration = getRandomDuration(2.5, 3.5);

/**
 * Component definition
 */

export default function Dashboard() {
  const dispatch = useDispatch();
  const storageKey = useMemo(() => ['sites', 'site'], []) as StorageKey[];
  const { sites, isLoading } = useAppSelector((state) => state.dashboard);

  const onLoaded = useCallback(
    async (data: { sites: Site[] | null; site: Site | null } | null) => {
      if (!data) {
        dispatch(setIsLoading(false));
        return;
      }

      const updatedSites = data.sites ?? [];

      if (data.site) {
        const i = updatedSites.findIndex((s) => s.id === data.site!.id);

        if (i === -1) {
          updatedSites.push(data.site);
        } else {
          updatedSites[i] = data.site;
        }
      }

      await AppStorage.setItem(StorageKey.Site, null);
      dispatch(setSites(updatedSites));
      dispatch(setIsLoading(false));
    },
    [dispatch]
  );

  useLoadFromStorage<{ sites: Site[] | null; site: Site | null }>({
    storageKey,
    loadingDuration,
    onLoaded
  });

  useEffect(() => {
    AppStorage.setItem(StorageKey.Sites, sites);
  }, [sites]);

  if (isLoading) {
    return (
      <>
        <title>{'Loading Sites... - Wepify Dashboard'}</title>
        <LoadingScreen duration={loadingDuration} />;
      </>
    );
  }

  return (
    <StyledDashboard>
      <title>Wepify Dashboard — Manage Your Websites</title>
      <Toaster position='bottom-left' />
      <Header />
      <DashboardLayout>
        <Sidebar />
        <Main />
      </DashboardLayout>
    </StyledDashboard>
  );
}

/**
 * Styles
 */

const StyledDashboard = styled.div`
  padding: 1.2rem 2.4rem;
  user-select: none;

  & > div:nth-of-type(2) {
    margin-top: 1.2rem;
  }
`;

const DashboardLayout = styled.div`
  display: flex;
`;
