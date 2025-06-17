import localforage from 'localforage';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Header from '../features/dashboard/Header';
import Main from '../features/dashboard/main/Main';
import Sidebar from '../features/dashboard/Sidebar';
import { setSites } from '../features/dashboard/slices/dashboardSlice';
import { useAppSelector } from '../store';
import type { Site } from '../types';

/**
 * Styles
 */

const StyledDashboard = styled.div`
  padding: 1.2rem 2.4rem;

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
  const { sites } = useAppSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadSites() {
      const sites = (await localforage.getItem('sites')) as Site[];
      if (sites) dispatch(setSites(sites));
    }

    loadSites();
  }, [dispatch]);

  useEffect(() => {
    localforage.setItem('sites', sites);
  }, [sites]);

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
