import { Site } from '@shared/types';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingScreen from '../../components/LoadingScreen';
import { LoadingMessages, Path, StorageKey } from '../../constant';
import { useIframeContext } from '../../context/IframeContext';
import { useLoadFromStorage } from '../../hooks/useLoadFromStorage';
import { useAppSelector } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { getRandomDuration } from '../../utils/getRandomDuration';
import { isTyping } from '../../utils/isTyping';
import { setIsLoading as setDashboardIsLoading } from '../dashboard/slices/dashboardSlice';
import { setIsError, setIsLoading, setSite } from './slices/editorSlice';
import { setHeight, setPage, setWidth } from './slices/pageSlice';
import { selectElement } from './slices/selectionSlice';

/**
 * Constants
 */

const loadingDuration = getRandomDuration(1.5, 3.5);
const IFRAME_SRC = '/iframe/iframe.html';
const IFRAME_TITLE = 'Site Preview';
const SIZE_FILL = '100%';
const SIZE_SCREEN = '100vh';
const DELETE_KEY = 'Backspace';

/**
 * Component definition
 */

export default function Canvas({ isPreview }: { isPreview: boolean }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const { pageId } = useParams();
  const { iframeConnection, iframeRef } = useIframeContext();
  const { width, height, scale } = useAppSelector((state) => state.page);
  const { images, site, isLoading, isError } = useAppSelector((state) => state.editor);

  const onLoaded = useCallback(
    (site: Site | null) => {
      if (!site) return dispatch(setIsError(true));

      const page = site?.pages.find((p) => p.id === pageId);

      if (site && page && canvasRef.current) {
        dispatch(setWidth(canvasRef.current.clientWidth));
        dispatch(setHeight(canvasRef.current.clientHeight));
        dispatch(setSite(site));
        dispatch(setPage(page));
        dispatch(selectElement(page.elements[0]));
        setTimeout(() => dispatch(setIsLoading(false)), 100);
      } else {
        dispatch(setIsError(true));
      }
    },
    [canvasRef, dispatch, pageId]
  );

  useLoadFromStorage<Site>({
    storageKey: StorageKey.Site,
    loadingDuration,
    onLoaded
  });

  useEffect(() => {
    if (!site.id) return;
    AppStorage.setItem(StorageKey.Site, site);
  }, [site]);

  useEffect(() => {
    AppStorage.setItem(StorageKey.Images, images);
  }, [images]);

  useEffect(() => {
    if (iframeConnection.iframeReady && !isLoading) {
      const elements = site.pages.find((p) => p.id === pageId)?.elements;

      iframeConnection.renderElements(elements, isPreview);
    }
  }, [iframeConnection, isLoading, isPreview, pageId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === DELETE_KEY && !isTyping(iframeRef)) {
        iframeConnection.deleteElement();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const iframeDoc = iframeRef.current?.contentWindow;

    iframeDoc?.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      iframeDoc?.removeEventListener('keydown', handleKeyDown);
    };
  }, [iframeConnection, iframeRef]);

  useEffect(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    const iframeRoot = iframeDoc?.querySelector<HTMLElement>('#iframe-root');

    if (!iframeRoot) return;

    iframeRoot.style.width = isPreview ? SIZE_FILL : `${width}px`;
    iframeRoot.style.height = isPreview ? SIZE_SCREEN : `${height}px`;
    iframeRoot.style.scale = `${isPreview ? 1 : scale / 100}`;
    iframeRoot.style.transformOrigin = 'top left';
  }, [iframeRef, width, height, scale, isPreview]);

  return (
    <StyledCanvas ref={canvasRef} $isPreview={isPreview}>
      <iframe ref={iframeRef} src={IFRAME_SRC} title={IFRAME_TITLE} />
      {isLoading && (
        <LoadingScreen
          handler={() => {
            dispatch(setDashboardIsLoading(true));
            navigate(Path.Dashboard);
          }}
          buttonText={isError ? 'Back to Dashboard' : ''}
          text={isError ? LoadingMessages.Error : isPreview ? LoadingMessages.SitePreview : LoadingMessages.Editor}
        />
      )}
    </StyledCanvas>
  );
}

/**
 * Styles
 */

const StyledCanvas = styled.div<{ $isPreview: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-black-light);
  overflow: auto;

  iframe {
    transform: translateZ(0);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform;
    border: none;
    width: 100%;
    height: 100vh;
    overflow: auto;
  }
`;
