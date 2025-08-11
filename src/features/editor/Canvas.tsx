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
import { calculateScaleToFit } from '../../utils/calculateScaleToFit';
import { setIsLoading as setDashboardIsLoading } from '../dashboard/slices/dashboardSlice';
import { usePanel } from './context/PanelContext';
import {
  clearSite,
  selectElement,
  setCurrentPageId,
  setDeviceType,
  setIsError,
  setIsLoading,
  setIsStoring,
  setPagesMetadata,
  setSite
} from './slices/editorSlice';
import { setHasOriginSize, setPage, setScale, setSize } from './slices/pageSlice';

/**
 * Constants
 */

const IFRAME_SRC = '/iframe/iframe.html';
const IFRAME_TITLE = 'Site Preview';
const SIZE_FILL = '100%';
const SIZE_SCREEN = '100vh';
const DEFAULT_DEVICE_TYPE = 'tablet';
const DELAY_STORE_TIMEOUT_MS = 2000;
const DELAY_LOADING_MS = 100;

/**
 * Component definition
 */

export default function Canvas({ isPreview }: { isPreview: boolean }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const { pageId } = useParams();
  const { leftPanelOpen } = usePanel();
  const { iframeConnection, iframeRef } = useIframeContext();
  const { hasSetOriginSize, backgroundColor, width, height, scale } = useAppSelector((state) => state.page);
  const { site, images, isLoading, isError, deviceType } = useAppSelector((state) => state.editor);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLoaded = useCallback(
    async (site: Site | null) => {
      if (!site) return dispatch(setIsError(true));

      const page = site.pages.find((p) => p.id === pageId);

      if (!iframeConnection.iframeReady) return;

      if (site && page && canvasRef.current && pageId) {
        const pagesMetadata = site.pages.map(({ elements: _, ...pageWithoutElements }) => pageWithoutElements);

        dispatch(setPagesMetadata(pagesMetadata));
        dispatch(setCurrentPageId(pageId));

        dispatch(
          setSize({
            width: SCREEN_SIZES.tablet.width,
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

        setTimeout(() => dispatch(setIsLoading(false)), DELAY_LOADING_MS);
      } else {
        dispatch(setIsError(true));
      }
    },
    [iframeConnection.iframeReady, canvasRef, dispatch, pageId]
  );

  useLoadFromStorage<Site | null>({
    storageKey: StorageKey.Site,
    onLoaded
  });

  useEffect(() => {
    if (!hasSetOriginSize || !canvasRef?.current) return;

    const canvas = canvasRef.current;
    const screenSize = SCREEN_SIZES[deviceType];
    const originWidth = canvas.clientWidth;
    const originHeight = canvas.clientHeight;

    dispatch(setHasOriginSize(false));
    dispatch(setSize({ ...screenSize, originWidth, originHeight }));

    const scaleFactor = calculateScaleToFit({ width: originWidth, height: originHeight }, screenSize);

    dispatch(setScale(scaleFactor));
  }, [dispatch, canvasRef, deviceType, hasSetOriginSize, leftPanelOpen]);

  useEffect(() => {
    if (!site.id || site.pages.length === 0) return;

    const saveInStorage = async () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      console.log(site);
      await AppStorage.setItem(StorageKey.Site, site);

      timeoutRef.current = setTimeout(() => {
        dispatch(setIsStoring(false));
        timeoutRef.current = null;
      }, DELAY_STORE_TIMEOUT_MS);
    };

    saveInStorage();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [dispatch, site, isLoading]);

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

    iframeRoot.style.width = isPreview ? SIZE_FILL : `${width + PAGE_PADDING_X}px`;
    iframeRoot.style.height = isPreview ? SIZE_SCREEN : `${height}px`;
    iframeRoot.style.scale = `${isPreview ? 1 : scale / DEFAULT_SCALE_FACTOR}`;
    iframeRoot.style.transformOrigin = 'top left';
  }, [isLoading, iframeRef, width, height, scale, isPreview]);

  useDeleteKeyHandler({
    iframeRef,
    onDelete: () => iframeConnection.deleteElement()
  });

  return (
    <StyledCanvas ref={canvasRef} $isPreview={isPreview} id='canvas'>
      <title>
        {isLoading
          ? isPreview
            ? 'Loading preview — Wepify Website Builder'
            : 'Opening editor — Wepify Website Builder'
          : isPreview
            ? `Previewing ${site.name} — Wepify Website Builder`
            : `Editing ${site.name} — Wepify Website Builder`}
      </title>
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
  position: relative;
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
