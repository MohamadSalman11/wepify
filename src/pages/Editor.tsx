import { UNSAVED_CHANGES_MESSAGE } from '@shared/constants';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useBeforeUnload, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { IframeContext } from '../context/IframeContext';
import Canvas from '../features/editor/Canvas';
import { usePanel } from '../features/editor/context/PanelContext';
import Header from '../features/editor/Header';
import { useIframeConnection } from '../features/editor/hooks/useIframeConnection';
import Panel from '../features/editor/panels';
import Sidebar from '../features/editor/Sidebar';
import { useAppSelector } from '../store';

/**
 * Component definition
 */

export default function Editor() {
  const location = useLocation();
  const { leftPanelOpen } = usePanel();
  const isPreview = location.pathname.endsWith('/preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeConnection = useIframeConnection(iframeRef);
  const isStoring = useAppSelector((state) => state.editor.isStoring);

  useBeforeUnload((event) => {
    if (isStoring && !isPreview) {
      event.preventDefault();
      event.returnValue = UNSAVED_CHANGES_MESSAGE;
    }
  });

  if (isPreview) {
    return (
      <IframeContext.Provider value={{ iframeRef, iframeConnection }}>
        <StyledEditor $isPreview={isPreview}>
          <Outlet />
        </StyledEditor>
      </IframeContext.Provider>
    );
  }

  return (
    <IframeContext.Provider value={{ iframeRef, iframeConnection }}>
      <StyledEditor $leftPanelOpen={leftPanelOpen}>
        <Toaster position='top-center' reverseOrder={false} />
        <Sidebar />
        <Header />
        {leftPanelOpen && <Outlet />}
        <Canvas isPreview={isPreview} />
        <Panel panel='settings' sectioned borderDir='left' />
      </StyledEditor>
    </IframeContext.Provider>
  );
}

/**
 * Styles
 */

const StyledEditor = styled.div<{ $isPreview?: boolean; $leftPanelOpen?: boolean }>`
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
