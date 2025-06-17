import { useEffect, type RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import type { Site } from '../../../types';
import { updatePageElements } from '../../dashboard/slices/dashboardSlice';
import { setPage } from '../slices/pageSlice';
import { useIframeConnection } from './useIframeConnection';

export const useCanvasSync = (iframeRef: RefObject<HTMLIFrameElement | null>, sites: Site[]) => {
  const dispatch = useDispatch();
  const { site: siteParam, page: pageParam } = useParams();
  const { elements, lastAddedElement, id, siteId } = useAppSelector((s) => s.page);
  const { selectedElement, lastUpdates } = useAppSelector((s) => s.selection);
  const { iframeReady, sendElementsToIframe, updateElementInIFrame, insertElementInIFrame, handleSelectionChange } =
    useIframeConnection(iframeRef, elements);

  useEffect(() => {
    if (iframeReady) {
      const site = sites.find((site) => site.id === siteParam);
      const page = site?.pages.find((page) => page.id === pageParam);

      sendElementsToIframe(elements);

      if (site && page) {
        dispatch(setPage({ ...page, siteId: site.id, siteName: site.name, siteDescription: site.description }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeReady, sendElementsToIframe]);

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
