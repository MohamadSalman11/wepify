import { DEFAULT_SCALE_FACTOR, PAGE_PADDING_X, SCREEN_SIZES } from '@shared/constants';
import { Site } from '@shared/typing';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingScreen from '../../components/LoadingScreen';
import { LoadingMessages, Path, StorageKey } from '../../constant';
import { useIframeContext } from '../../context/IframeContext';
import { useDeleteKeyHandler } from '../../hooks/useDeleteKeyHandler';
import { useLoadFromStorage } from '../../hooks/useLoadFromStorage';
import { useAppSelector } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { getRandomDuration } from '../../utils/getRandomDuration';
import { setIsLoading as setDashboardIsLoading } from '../dashboard/slices/dashboardSlice';
import { clearSite, setDeviceType, setIsError, setIsLoading, setSite } from './slices/editorSlice';
import { setPage, setScale, setSize } from './slices/pageSlice';
import { selectElement } from './slices/selectionSlice';

/**
 * Constants
 */

const loadingDuration = getRandomDuration(1.5, 3.5);
const IFRAME_SRC = '/iframe/iframe.html';
const IFRAME_TITLE = 'Site Preview';
const SIZE_FILL = '100%';
const SIZE_SCREEN = '100vh';
const DEFAULT_DEVICE_TYPE = 'tablet';

/**
 * Component definition
 */

export default function Canvas({ isPreview }: { isPreview: boolean }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const { pageId } = useParams();
  const { iframeConnection, iframeRef } = useIframeContext();
  const { backgroundColor, width, height, scale } = useAppSelector((state) => state.page);
  const { images, site, isLoading, isError, deviceType } = useAppSelector((state) => state.editor);

  const onLoaded = useCallback(
    (site: Site | null) => {
      if (!site) return dispatch(setIsError(true));

      const page = site?.pages.find((p) => p.id === pageId);

      if (!iframeConnection.iframeReady) return;

      if (site && page && canvasRef.current) {
        console.log(page);
        dispatch(
          setSize({
            width: SCREEN_SIZES.tablet.width + PAGE_PADDING_X,
            height: SCREEN_SIZES.tablet.height,
            originWidth: canvasRef.current.clientWidth,
            originHeight: canvasRef.current.clientHeight
          })
        );

        dispatch(setSite(site));
        dispatch(setPage(page));
        dispatch(selectElement(page.elements[0]));
        dispatch(setScale(DEFAULT_SCALE_FACTOR));
        dispatch(setDeviceType(DEFAULT_DEVICE_TYPE));
        setTimeout(() => dispatch(setIsLoading(false)), 100);
      } else {
        dispatch(setIsError(true));
      }
    },
    [iframeConnection.iframeReady, canvasRef, dispatch, pageId]
  );

  useLoadFromStorage<Site>({
    storageKey: StorageKey.Site,
    loadingDuration,
    onLoaded
  });

  useEffect(() => {
    if (!site.id) return;
    AppStorage.setItem(StorageKey.Site, site);
  }, [site, isLoading]);

  useEffect(() => {
    AppStorage.setItem(StorageKey.Images, images);
  }, [images]);

  useEffect(() => {
    return () => {
      dispatch(clearSite());
    };
  }, [dispatch]);

  useEffect(() => {
    if (iframeConnection.iframeReady && !isLoading) {
      const elements = site.pages.find((p) => p.id === pageId)?.elements;

      if (!elements) {
        dispatch(setIsError(true));
        return;
      }

      iframeConnection.renderElements(elements, isPreview, deviceType, scale, backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, iframeConnection, isLoading, isPreview, pageId, deviceType, scale, backgroundColor]);

  useEffect(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    const iframeRoot = iframeDoc?.querySelector<HTMLElement>('#iframe-root');

    if (!iframeRoot || isLoading) return;

    iframeRoot.style.width = isPreview ? SIZE_FILL : `${width}px`;
    iframeRoot.style.height = isPreview ? SIZE_SCREEN : `${height}px`;
    iframeRoot.style.scale = `${isPreview ? 1 : scale / DEFAULT_SCALE_FACTOR}`;
    iframeRoot.style.transformOrigin = 'top left';
  }, [isLoading, iframeRef, width, height, scale, isPreview]);

  useDeleteKeyHandler({ iframeRef, onDelete: () => iframeConnection.deleteElement() });

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
