import localforage from 'localforage';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useLoadSitesFromStorage } from '../../hooks/useLoadSitesFromStorage';
import { useAppSelector } from '../../store';
import { useCanvasSync } from './hooks/useCanvasSync';
import { setHeight, setWidth } from './slices/pageSlice';

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

  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useCanvasSync(iframeRef, sites, isPreview);

  useLoadSitesFromStorage();

  useEffect(() => {
    if (sites.length > 0) {
      localforage.setItem('sites', sites);
    }
  }, [sites]);

  const handleIframeLoad = () => {
    if (canvasRef.current && !isPreview) {
      dispatch(setWidth(canvasRef.current.clientWidth));
      dispatch(setHeight(canvasRef.current.clientHeight));
    }
  };

  return (
    <StyledCanvas ref={canvasRef}>
      <iframe
        ref={iframeRef}
        src='/iframe/iframe.html'
        title='Site Preview'
        onLoad={handleIframeLoad}
        style={{
          width: width === undefined || isPreview ? '100%' : `${width}px`,
          height: height === undefined || isPreview ? '100vh' : `${height}px`,
          transform: `scale(${scale / 100})`
        }}
      />
    </StyledCanvas>
  );
}

export default Canvas;
