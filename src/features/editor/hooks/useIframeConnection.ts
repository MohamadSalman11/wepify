import {
  MessageFromIframe,
  MessageToIframe,
  type MessageData,
  type PageElement,
  type Site,
  type SitePage
} from '@shared/types';
import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { StorageKey, TARGET_ORIGIN } from '../../../constant';
import { AppStorage } from '../../../utils/appStorage';
import { findElementById } from '../../../utils/findElementById';
import { addElement } from '../slices/pageSlice';
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
      const data: MessageData = event.data;

      switch (data.type) {
        case MessageFromIframe.IframeReady: {
          setIframeReady(true);
          break;
        }
        case MessageFromIframe.SelectionChanged: {
          dispatch(selectElement(data.payload));
          break;
        }
        case MessageFromIframe.UpdateElement: {
          const { id, fields } = data.payload;
          dispatch(updateSelectElement(fields));
          await saveElementInStorage(pageId, id, (element) => {
            Object.assign(element, fields);
          });
          break;
        }
        case MessageFromIframe.InsertElement: {
          const { parentId, element } = data.payload;
          dispatch(addElement(element));

          await saveElementInStorage(pageId, parentId, (parent) => {
            parent.children?.push(element);
          });

          if (element.name === 'image') {
            const images: string[] | null = await AppStorage.getItem(StorageKey.Images);
            await AppStorage.setItem(StorageKey.Images, [...(images || []), element.src]);
          }

          break;
        }
        case MessageFromIframe.ElementDeleted: {
          const { targetId, parentId } = data.payload;
          await saveElementInStorage(pageId, parentId, (parent) => {
            parent.children = parent.children.filter((el) => el.id !== targetId);
          });
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, iframeRef, pageId]);

  const sendElements = useCallback(
    (elements: PageElement[], isPreview: boolean) => {
      postMessageToIframe({ type: MessageToIframe.ReceiveElements, payload: { isPreview, elements } });
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
      postMessageToIframe({ type: MessageToIframe.SelectionChanged, payload: id });
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

  return useMemo(
    () => ({
      iframeReady,
      sendElements,
      updateElement,
      insertElement,
      handleSelectionChange,
      searchElement,
      deleteElement,
      downloadSite
    }),
    [
      iframeReady,
      sendElements,
      updateElement,
      insertElement,
      handleSelectionChange,
      searchElement,
      deleteElement,
      downloadSite
    ]
  );
};

const saveElementInStorage = async (
  pageId: string | undefined,
  elementId: string,
  fn: (element: PageElement) => void
) => {
  const site = await AppStorage.getItem<Site>(StorageKey.Site);
  const page = site?.pages.find((p) => p.id === pageId);

  site.lastModified = Date.now();

  if (!site || !page) return;

  const element = findElementById(elementId, page.elements);

  if (element) {
    fn(element);
  }

  await AppStorage.setItem(StorageKey.Site, site);
};
