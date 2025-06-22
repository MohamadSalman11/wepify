import localforage from 'localforage';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import LoadingScreen from '../../components/LoadingScreen';
import { LoadingMessages } from '../../constant';
import { useLoadSitesFromStorage } from '../../hooks/useLoadSitesFromStorage';
import { useAppSelector } from '../../store';
import { useCanvasSync } from './hooks/useCanvasSync';

/**
 * Styles
 */

const StyledCanvas = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--color-black-light);

  iframe {
    border: none;
  }
`;

/**
 * Component definition
 */

function Canvas({ isPreview }: { isPreview: boolean }) {
  const { width, height, scale } = useAppSelector((state) => state.page);
  const { sites } = useAppSelector((state) => state.dashboard);
  const { isLoading, loadingDuration, targetDownloadSite } = useAppSelector((state) => state.editor);

  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useCanvasSync(iframeRef, canvasRef, sites, isPreview, loadingDuration, targetDownloadSite);

  useLoadSitesFromStorage(loadingDuration);

  useEffect(() => {
    if (sites.length > 0) {
      localforage.setItem('sites', sites);
    }
  }, [sites]);

  return (
    <StyledCanvas ref={canvasRef}>
      <iframe
        ref={iframeRef}
        src='/iframe/iframe.html'
        title='Site Preview'
        style={{
          width: width === undefined || isPreview ? '100%' : `${width}px`,
          height: height === undefined || isPreview ? '100vh' : `${height}px`,
          transform: `scale(${scale / 100})`
        }}
      />
      {isLoading && <LoadingScreen loadingText={isPreview ? LoadingMessages.SitePreview : LoadingMessages.Editor} />}
    </StyledCanvas>
  );
}

export default Canvas;
