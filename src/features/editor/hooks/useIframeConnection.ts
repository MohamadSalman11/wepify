import { TARGET_ORIGIN } from '@shared/constants';
import {
  DeviceType,
  MessageFromIframe,
  MessageFromIframeData,
  MessageToIframe,
  PageElement,
  Site
} from '@shared/typing';
import { generateFileNameFromPageName } from '@shared/utils';
import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { EditorPath } from '../../../constant';
import { useAppSelector } from '../../../store';
import {
  addElement,
  deleteElementInSite,
  selectElement,
  setDeviceType,
  setIsDownloadingSite,
  setLastDeletedElement,
  updateElementInSite,
  updatePageInSite,
  updateSelectElement
} from '../slices/editorSlice';
import { setBackground } from '../slices/pageSlice';

const PAGE_NAME_INDEX = 'index';
const PAGE_PATH_SEGMENT_REGEX = new RegExp(`${EditorPath.Pages}[^/]+`);

export const useIframeConnection = (iframeRef: RefObject<HTMLIFrameElement | null>) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [iframeReady, setIframeReady] = useState(false);
  const pagesMetadata = useAppSelector((state) => state.editor.pagesMetadata);

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

      switch (data.type) {
        case MessageFromIframe.IframeReady: {
          setIframeReady(true);
          break;
        }
        case MessageFromIframe.BreakpointChanged: {
          dispatch(setDeviceType(data.payload.newDeviceType));
          break;
        }
        case MessageFromIframe.SelectionChanged: {
          dispatch(selectElement(data.payload));
          break;
        }
        case MessageFromIframe.ElementUpdated: {
          const { id, fields } = data.payload;

          dispatch(updateSelectElement(fields));

          dispatch(
            updateElementInSite({
              elementId: id,
              updates: fields
            })
          );
          break;
        }
        case MessageFromIframe.PageUpdated: {
          const { updates } = data.payload;

          if (updates.backgroundColor) {
            dispatch(setBackground(updates.backgroundColor));
          }

          dispatch(updatePageInSite(updates));
          break;
        }
        case MessageFromIframe.ElementInserted: {
          const { parentId, element } = data.payload;
          dispatch(addElement({ parentElementId: parentId, newElement: element }));
          break;
        }
        case MessageFromIframe.ElementDeleted: {
          const { element, parentId } = data.payload;

          dispatch(setLastDeletedElement(element));
          dispatch(deleteElementInSite({ parentElementId: parentId, elementId: element.id }));
          break;
        }
        case MessageFromIframe.SiteDownloaded: {
          dispatch(setIsDownloadingSite(false));
          break;
        }
        case MessageFromIframe.NavigateToPage: {
          const pageFileName = data.payload;

          for (const page of pagesMetadata) {
            const pageName = page.isIndex ? PAGE_NAME_INDEX : page.name;
            const generatedFileName = generateFileNameFromPageName(pageName);

            if (generatedFileName === pageFileName) {
              const currentPath = location.pathname;
              const updatedPath = currentPath.replace(PAGE_PATH_SEGMENT_REGEX, `/${EditorPath.Pages}/${page.id}`);
              navigate(updatedPath);
              break;
            }
          }
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, navigate, iframeRef, pagesMetadata, location.pathname]);

  const renderElements = useCallback(
    (
      elements: PageElement[],
      isPreview: boolean,
      deviceType: DeviceType,
      scaleFactor: number,
      backgroundColor: string
    ) => {
      postMessageToIframe({
        type: MessageToIframe.RenderElements,
        payload: { isPreview, elements, deviceType, scaleFactor, backgroundColor }
      });
    },
    [postMessageToIframe]
  );

  const insertElement = useCallback(
    ({
      name,
      element,
      additionalProps
    }: {
      name?: string;
      element?: PageElement;
      additionalProps?: Record<string, any>;
    }) => {
      postMessageToIframe({ type: MessageToIframe.InsertElement, payload: { name, element, additionalProps } });
    },
    [postMessageToIframe]
  );

  const updateElement = useCallback(
    (updates: Record<string, any>) => {
      postMessageToIframe({ type: MessageToIframe.UpdateElement, payload: { updates } });
    },
    [postMessageToIframe]
  );

  const updatePage = useCallback(
    (updates: Record<string, any>) => {
      postMessageToIframe({ type: MessageToIframe.UpdatePage, payload: { updates } });
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
    (site: Site, shouldMinify: boolean) => {
      postMessageToIframe({ type: MessageToIframe.DownloadSite, payload: { site, shouldMinify } });
    },
    [postMessageToIframe]
  );

  const initializeState = useCallback(() => {
    postMessageToIframe({ type: MessageToIframe.InitializeState });
  }, [postMessageToIframe]);

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
      updatePage,
      initializeState
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
      updatePage,
      initializeState
    ]
  );
};
