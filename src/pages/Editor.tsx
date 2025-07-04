import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { IframeContext } from '../context/IframeContext';
import Canvas from '../features/editor/Canvas';
import Header from '../features/editor/Header';
import { useIframeConnection } from '../features/editor/hooks/useIframeConnection';
import Panel from '../features/editor/panels';
import Sidebar from '../features/editor/Sidebar';

/**
 * Component definition
 */

export default function Editor() {
  const location = useLocation();
  const isPreview = location.pathname.endsWith('/preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeConnection = useIframeConnection(iframeRef);

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
      <StyledEditor>
        <Toaster position='top-center' reverseOrder={false} />
        <Sidebar />
        <Header />
        <Outlet />
        <Canvas isPreview={isPreview} />
        <Panel panel='settings' sectioned={true} borderDir='left' />
      </StyledEditor>
    </IframeContext.Provider>
  );
}

/**
 * Styles
 */

const editorLayout = css`
  display: grid;
  grid-template-columns: 10rem 34rem 3.5fr 34rem;
  grid-template-rows: 8rem 1fr;
`;

const StyledEditor = styled.div<{ $isPreview?: boolean }>`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  user-select: none;
  ${({ $isPreview }) => !$isPreview && editorLayout}
`;
