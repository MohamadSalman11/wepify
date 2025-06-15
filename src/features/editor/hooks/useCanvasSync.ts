import localforage from 'localforage';
import { useEffect, type RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../store';
import { setPage } from '../slices/pageSlice';
import { useIframeConnection } from './useIframeConnection';

export const useCanvasSync = (iframeRef: RefObject<HTMLIFrameElement | null>) => {
  const dispatch = useDispatch();

  const { elements, lastAddedElement, id } = useAppSelector((s) => s.page);
  const { selectedElement, lastUpdates } = useAppSelector((s) => s.selection);

  const { iframeReady, sendElementsToIframe, updateElementInIFrame, insertElementInIFrame, handleSelectionChange } =
    useIframeConnection(iframeRef, elements);

  useEffect(() => {
    if (iframeReady) sendElementsToIframe(elements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeReady, sendElementsToIframe]);

  useEffect(() => {
    updateElementInIFrame(lastUpdates);
  }, [lastUpdates, updateElementInIFrame]);

  useEffect(() => {
    localforage.setItem(id, { id, elements });
  }, [id, elements]);

  useEffect(() => {
    const loadPage = async () => {
      const page = await localforage.getItem(id);
      if (page) dispatch(setPage(page));
    };

    loadPage();
  }, [id, dispatch]);

  useEffect(() => {
    insertElementInIFrame(lastAddedElement);
  }, [lastAddedElement, insertElementInIFrame]);

  useEffect(() => {
    if (selectedElement.id) {
      handleSelectionChange(selectedElement.id);
    }
  }, [selectedElement.id, handleSelectionChange]);
};
