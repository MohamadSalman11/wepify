import type { Site } from '@shared/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingScreen from '../../components/LoadingScreen';
import { LoadingMessages, Path, StorageKey } from '../../constant';
import { useEditorContext } from '../../context/EditorContext';
import { useLoadFromStorage } from '../../hooks/useLoadFromStorage';
import { useAppSelector } from '../../store';
import { getRandomDuration } from '../../utils/getRandomDuration';
import { isTyping } from '../../utils/isTyping';
import { setIsLoading as setDashboardIsLoading } from '../dashboard/slices/dashboardSlice';
import { setIsLoading, setSite } from './slices/editorSlice';
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

export default function Canvas() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const { pageId } = useParams();
  const { iframeConnection, iframeRef, isPreview } = useEditorContext();
  const { width, height, scale, elements } = useAppSelector((state) => state.page);
  const { isLoading } = useAppSelector((state) => state.editor);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const onLoaded = useCallback(
    (site: Site | null) => {
      if (!site) return setIsError(true);

      const page = site?.pages.find((p) => p.id === pageId);

      if (site && page && canvasRef.current) {
        dispatch(setWidth(canvasRef.current.clientWidth));
        dispatch(setHeight(canvasRef.current.clientHeight));
        dispatch(setSite(site));
        dispatch(setPage(page));
        dispatch(selectElement(page.elements[0]));
        setIsDataLoaded(true);
        setTimeout(() => dispatch(setIsLoading(false)), 100);
      } else {
        setIsError(true);
      }
    },
    [canvasRef, dispatch, pageId, setIsDataLoaded, setIsError]
  );

  useLoadFromStorage<Site>({
    storageKey: StorageKey.Site,
    loadingDuration,
    onLoaded
  });

  useEffect(() => {
    if (iframeConnection.iframeReady && isDataLoaded) {
      iframeConnection.sendElements(elements, isPreview);
    }
  }, [iframeConnection, isDataLoaded]);

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

  return (
    <StyledCanvas ref={canvasRef}>
      <iframe
        ref={iframeRef}
        src={IFRAME_SRC}
        title={IFRAME_TITLE}
        style={{
          width: width === undefined || isPreview ? SIZE_FILL : `${width}px`,
          height: height === undefined || isPreview ? SIZE_SCREEN : `${height}px`,
          transform: `scale(${scale / 100})`
        }}
      />
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
