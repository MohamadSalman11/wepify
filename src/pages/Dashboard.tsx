import localforage from 'localforage';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../features/dashboard/Header';
import Main from '../features/dashboard/main/Main';
import Sidebar from '../features/dashboard/Sidebar';
import { useLoadSitesFromStorage } from '../hooks/useLoadSitesFromStorage';
import { useAppSelector } from '../store';

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
  const { sites, isLoading, loadingDuration } = useAppSelector((state) => state.dashboard.present);
  console.log(sites);

  useLoadSitesFromStorage(loadingDuration);

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
