import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import LoadingScreen from '../components/LoadingScreen';
import { loadSitesFromStorage } from '../features/dashboard/dashboardSlice';
import Header from '../features/dashboard/Header';
import Main from '../features/dashboard/main/Main';
import Sidebar from '../features/dashboard/Sidebar';
import { AppDispatch, useAppSelector } from '../store';

/**
 * Component definition
 */

export default function Dashboard() {
  const dispatch: AppDispatch = useDispatch();
  const isProcessing = useAppSelector((state) => state.dashboard.processing);
  const isLoading = useAppSelector((state) => state.dashboard.loading);

  useEffect(() => {
    dispatch(loadSitesFromStorage());
  }, [dispatch]);

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
