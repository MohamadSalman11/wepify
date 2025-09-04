import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Canvas from '../features/editor/Canvas';
import { loadSiteFromStorage } from '../features/editor/editorSlice';
import Header from '../features/editor/Header';
import Panel, { usePanel } from '../features/editor/panels';
import Sidebar from '../features/editor/Sidebar';
import { AppDispatch } from '../store';

/**
 * Component definition
 */

export default function Editor() {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const { siteId } = useParams();
  const { leftPanelOpen } = usePanel();
  const isPreview = location.pathname.endsWith('/preview');

  useEffect(() => {
    if (siteId) {
      dispatch(loadSiteFromStorage(siteId));
    }
  }, [dispatch, siteId]);

  if (isPreview) {
    return (
      <StyledEditor $isPreview={isPreview}>
        <Outlet />
      </StyledEditor>
    );
  }

  return (
    <StyledEditor $leftPanelOpen={leftPanelOpen}>
      <Toaster position='top-center' reverseOrder={false} />
      <Sidebar />
      <Header />
      {leftPanelOpen && <Outlet />}
      <Canvas />
      <Panel panel='settings' sectioned borderDir='left' />
    </StyledEditor>
  );
}

/**
 * Styles
 */

const StyledEditor = styled.div<{ $leftPanelOpen?: boolean; $isPreview?: boolean }>`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  user-select: none;

  ${({ $isPreview, $leftPanelOpen }) =>
    !$isPreview &&
    css`
      display: grid;
      grid-template-columns: ${$leftPanelOpen ? '8rem 30rem 1fr 30rem' : '8rem 1fr 30rem'};
      grid-template-rows: 8rem calc(100vh - 8rem);
    `}
`;
