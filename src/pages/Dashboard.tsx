import type { Site } from '@shared/types';
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
  const storageKey = useMemo(() => ['sites', 'site'], []);
  const { sites, isLoading } = useAppSelector((state) => state.dashboard);

  const onLoaded = useCallback(
    (data: { sites: Site[] | null; site: Site | null } | null) => {
      if (!data) {
        dispatch(setIsLoading(false));
        return;
      }

      const updatedSites = data.sites ?? [];

      if (data.site) {
        const i = updatedSites.findIndex((s) => s.id === data.site!.id);
        i >= 0 ? (updatedSites[i] = data.site) : updatedSites.push(data.site);
      }

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
    return <LoadingScreen duration={loadingDuration} />;
  }

  return (
    <StyledDashboard>
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
  overflow:;

  & > div:nth-of-type(2) {
    margin-top: 1.2rem;
  }
`;

const DashboardLayout = styled.div`
  display: flex;
`;
