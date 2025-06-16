import localforage from 'localforage';
import { useEffect, type RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import { setSites, updateSite } from '../../dashboard/dashboardSlice';
import { setPage } from '../slices/pageSlice';
import { useIframeConnection } from './useIframeConnection';

export const useCanvasSync = (iframeRef: RefObject<HTMLIFrameElement | null>) => {
  const dispatch = useDispatch();
  const { site: siteParam, page: pageParam } = useParams();

  const { elements, lastAddedElement, id, siteId } = useAppSelector((s) => s.page);
  const { selectedElement, lastUpdates } = useAppSelector((s) => s.selection);
  const { sites } = useAppSelector((s) => s.dashboard);

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
    if (!sites.length) return;
    localforage.setItem('sites', sites);
  }, [sites]);

  useEffect(() => {
    dispatch(updateSite({ siteId, pageId: id, elements }));
  }, [dispatch, siteId, id, elements]);

  useEffect(() => {
    const loadPage = async () => {
      const sites = await localforage.getItem('sites');
      const site = sites.find((s) => String(s.id) === siteParam + '');
      const page = site.pages.find((p) => String(p.id) === pageParam);
      console.log(page);
      if (page) dispatch(setPage(page));
      if (sites) dispatch(setSites(sites));
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
