import localforage from 'localforage';
import { useCallback, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../features/dashboard/Header';
import Main from '../features/dashboard/main/Main';
import Sidebar from '../features/dashboard/Sidebar';
import { setIsLoading, setSites } from '../features/dashboard/slices/dashboardSlice';
import { useLoadFromStorage } from '../hooks/useLoadFromStorage';
import { useAppSelector } from '../store';
import type { Site } from '../types';
import { getRandomDuration } from '../utils/getRandomDuration';

/**
 * Constants
 */

const loadingDuration = getRandomDuration(2.5, 3.5);

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

/**
 * Component definition
 */

function Dashboard() {
  const dispatch = useDispatch();
  const { sites, isLoading } = useAppSelector((state) => state.dashboard);

  const onLoaded = useCallback(
    (sites: Site[] | null) => {
      if (sites) dispatch(setSites(sites));
      dispatch(setIsLoading(false));
    },
    [dispatch]
  );

  useLoadFromStorage<Site[]>({
    storageKey: 'sites',
    loadingDuration,
    onLoaded
  });

  useEffect(() => {
    localforage.setItem('sites', sites);
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

export default Dashboard;
