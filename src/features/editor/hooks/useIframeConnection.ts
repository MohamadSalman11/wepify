import { MessageFromIframe, MessageFromIframeData, MessageToIframe, PageElement, type SitePage } from '@shared/types';
import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TARGET_ORIGIN } from '../../../constant';
import { addElement, deleteElementInSite, setIsDownloadingSite, updateElementInSite } from '../slices/editorSlice';
import { selectElement, updateSelectElement } from '../slices/selectionSlice';

export const useIframeConnection = (iframeRef: RefObject<HTMLIFrameElement | null>) => {
  const dispatch = useDispatch();
  const { pageId } = useParams();
  const [iframeReady, setIframeReady] = useState(false);

  const postMessageToIframe = useCallback(
    (message: Record<string, any>) => {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage(message, TARGET_ORIGIN);
      }
    },
    [iframeRef]
  );

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const data: MessageFromIframeData = event.data;

      if (!pageId) return;

      switch (data.type) {
        case MessageFromIframe.IframeReady: {
          setIframeReady(true);
          break;
        }
        case MessageFromIframe.SelectionChanged: {
          dispatch(selectElement(data.payload));
          break;
        }
        case MessageFromIframe.ElementUpdated: {
          const { id, fields } = data.payload;

          dispatch(updateSelectElement(fields));
          dispatch(updateElementInSite({ pageId, elementId: id, updates: fields }));
          break;
        }
        case MessageFromIframe.ElementInserted: {
          const { parentId, element } = data.payload;
          dispatch(addElement({ pageId, parentElementId: parentId, newElement: element }));
          break;
        }
        case MessageFromIframe.ElementDeleted: {
          const { targetId, parentId } = data.payload;
          dispatch(deleteElementInSite({ pageId, parentElementId: parentId, elementId: targetId }));
          break;
        }
        case MessageFromIframe.SiteDownloaded: {
          dispatch(setIsDownloadingSite(false));
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, iframeRef, pageId]);

  const renderElements = useCallback(
    (elements: PageElement[], isPreview: boolean) => {
      postMessageToIframe({ type: MessageToIframe.RenderElements, payload: { isPreview, elements } });
    },
    [postMessageToIframe]
  );

  const insertElement = useCallback(
    (name: string, additionalProps?: Record<string, any>) => {
      postMessageToIframe({ type: MessageToIframe.InsertElement, payload: { name, additionalProps } });
    },
    [postMessageToIframe]
  );

  const updateElement = useCallback(
    (updates: Record<string, any>) => {
      postMessageToIframe({ type: MessageToIframe.UpdateElement, payload: { updates } });
    },
    [postMessageToIframe]
  );

  const deleteElement = useCallback(() => {
    postMessageToIframe({ type: MessageToIframe.DeleteElement });
  }, [postMessageToIframe]);

  const handleSelectionChange = useCallback(
    (id: string) => {
      postMessageToIframe({ type: MessageToIframe.ChangeSelection, payload: id });
    },
    [postMessageToIframe]
  );

  const searchElement = useCallback(
    (id: string) => {
      postMessageToIframe({ type: MessageToIframe.SearchElement, payload: id });
    },
    [postMessageToIframe]
  );

  const downloadSite = useCallback(
    (site: SitePage[], shouldMinify: boolean) => {
      postMessageToIframe({ type: MessageToIframe.DownloadSite, payload: { site, shouldMinify } });
    },
    [postMessageToIframe]
  );

  const handleViewportChanged = useCallback(
    (scaleFactor: number) => {
      postMessageToIframe({ type: MessageToIframe.ViewPortChanged, payload: scaleFactor });
    },
    [postMessageToIframe]
  );

  return useMemo(
    () => ({
      iframeReady,
      renderElements,
      updateElement,
      insertElement,
      handleSelectionChange,
      searchElement,
      deleteElement,
      downloadSite,
      handleViewportChanged
    }),
    [
      iframeReady,
      renderElements,
      updateElement,
      insertElement,
      handleSelectionChange,
      searchElement,
      deleteElement,
      downloadSite,
      handleViewportChanged
    ]
  );
};
