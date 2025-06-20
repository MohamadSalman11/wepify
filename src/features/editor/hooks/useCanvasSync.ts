import { useEffect, type RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import type { PageElement, Site } from '../../../types';
import { flattenElements } from '../../../utils/flattenElements';
import { isTyping } from '../../../utils/isTyping';
import { updatePageElements } from '../../dashboard/slices/dashboardSlice';
import { setIsLoading } from '../slices/editorSlice';
import { deleteElement, setHeight, setPage, setWidth } from '../slices/pageSlice';
import { selectElement } from '../slices/selectionSlice';
import { useIframeConnection } from './useIframeConnection';

const DEFAULT_SECTION_ID = 'section-1';
const DELETE_KEY = 'Backspace';

export const useCanvasSync = (
  iframeRef: RefObject<HTMLIFrameElement | null>,
  canvasRef: RefObject<HTMLDivElement | null>,
  sites: Site[],
  isPreview: boolean,
  loadingDuration: number
) => {
  const dispatch = useDispatch();
  const { site: siteParam, page: pageParam } = useParams();
  const { elements, lastAddedElement, id, siteId } = useAppSelector((s) => s.page);
  const { selectedElement, lastUpdates, lastSelectedSection } = useAppSelector((s) => s.selection);
  const {
    iframeReady,
    sendElementsToIframe,
    updateElementInIFrame,
    insertElementInIFrame,
    deleteElementInIframe,
    handleSelectionChange
  } = useIframeConnection(iframeRef, elements, isPreview);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (iframeReady) {
      const site = sites.find((site) => site.id === siteParam);
      const page = site?.pages.find((page) => page.id === pageParam);

      if (site && page) {
        sendElementsToIframe(page.elements);
        dispatch(selectElement(page.elements[0]));
        dispatch(setPage({ ...page, siteId: site.id, siteName: site.name, siteDescription: site.description }));

        timeoutId = setTimeout(() => {
          dispatch(setIsLoading(false));

          dispatch(setWidth(canvasRef.current?.clientWidth));
          dispatch(setHeight(canvasRef.current?.clientHeight));
        }, loadingDuration);
      }
    }

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeReady, siteParam, pageParam, sendElementsToIframe]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === DELETE_KEY && selectedElement.id !== DEFAULT_SECTION_ID && !isTyping(iframeRef)) {
        const section = flattenElements(elements).find((el) => el.id === lastSelectedSection) as PageElement;

        deleteElementInIframe(selectedElement.id);
        dispatch(deleteElement(selectedElement.id));
        dispatch(selectElement(section));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const iframeDoc = iframeRef.current?.contentWindow;

    console.log(iframeDoc?.document.activeElement);

    iframeDoc?.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      iframeDoc?.removeEventListener('keydown', handleKeyDown);
    };
  }, [iframeRef, dispatch, selectedElement, lastSelectedSection, elements, deleteElementInIframe]);

  useEffect(() => {
    updateElementInIFrame(lastUpdates);
  }, [lastUpdates, updateElementInIFrame]);

  useEffect(() => {
    dispatch(updatePageElements({ siteId, pageId: id, elements }));
  }, [dispatch, siteId, id, elements]);

  useEffect(() => {
    if (lastAddedElement) {
      insertElementInIFrame(lastAddedElement);
    }
  }, [lastAddedElement, insertElementInIFrame]);

  useEffect(() => {
    if (selectedElement.id) {
      handleSelectionChange(selectedElement.id);
    }
  }, [selectedElement.id, handleSelectionChange]);
};
