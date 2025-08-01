import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { TOAST_DURATION, ToastMessages } from '../constant';
import { IframeContext } from '../context/IframeContext';
import Canvas from '../features/editor/Canvas';
import { usePanel } from '../features/editor/context/PanelContext';
import Header from '../features/editor/Header';
import { useIframeConnection } from '../features/editor/hooks/useIframeConnection';
import Panel from '../features/editor/panels';
import Sidebar from '../features/editor/Sidebar';

/**
 * Component definition
 */

export default function Editor() {
  const location = useLocation();
  const { leftPanelOpen } = usePanel();
  const isPreview = location.pathname.endsWith('/preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeConnection = useIframeConnection(iframeRef);

  useEffect(() => {
    const handleOffline = () => {
      toast.error(ToastMessages.network.offline, { duration: TOAST_DURATION });
    };

    const handleOnline = () => {
      toast.success(ToastMessages.network.online, { duration: TOAST_DURATION });
    };

    globalThis.addEventListener('offline', handleOffline);
    globalThis.addEventListener('online', handleOnline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      globalThis.removeEventListener('offline', handleOffline);
      globalThis.removeEventListener('online', handleOnline);
    };
  }, []);

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
        <Panel panel='settings' sectioned={true} borderDir='left' />
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
