import { RefObject, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TARGET_ORIGIN } from '../../../constant';
import type { PageElement } from '../../../types';
import { flattenElements } from '../../../utils/flatten-elements';
import { updateElement } from '../slices/pageSlice';
import { selectElement, setLastSelectedSection, updateSelectElement } from '../slices/selectionSlice';

type IframeMessage =
  | { type: 'IFRAME_READY' }
  | { type: 'ELEMENT_CLICKED'; payload: { id: string } }
  | { type: 'UPDATE_POSITION'; payload: { id: string; left: number; top: number } }
  | { type: 'UPDATE_SIZE'; payload: { id: string; width: number; height: number } }
  | { type: 'UPDATE_TRANSFORM'; payload: { id: string; transform: string } }
  | { type: 'UPDATE_ITEM_CONTENT'; payload: { id: string; content: string } };

export const useIframeConnection = (iframeRef: RefObject<HTMLIFrameElement | null>, elements: PageElement[]) => {
  const dispatch = useDispatch();
  const [iframeReady, setIframeReady] = useState(false);

  const postMessageToIframe = useCallback(
    (message: object) => {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage(message, TARGET_ORIGIN);
      }
    },
    [iframeRef]
  );

  useEffect(() => {
    const flatElements = flattenElements(elements);

    const handleMessage = (event: MessageEvent) => {
      const data: IframeMessage = event.data;

      switch (data.type) {
        case 'IFRAME_READY':
          setIframeReady(true);
          break;
        case 'ELEMENT_CLICKED': {
          const el = flatElements.find((el) => el.id === data.payload.id);
          if (el) dispatch(selectElement(el));

          if (el.name === 'section') {
            dispatch(setLastSelectedSection(el.id));
          }
          break;
        }
        case 'UPDATE_POSITION':
          dispatch(updateSelectElement({ left: data.payload.left, top: data.payload.top }));
          dispatch(updateElement({ id: data.payload.id, updates: { left: data.payload.left, top: data.payload.top } }));
          break;
        case 'UPDATE_SIZE':
          dispatch(updateSelectElement({ width: data.payload.width, height: data.payload.height }));
          dispatch(
            updateElement({ id: data.payload.id, updates: { width: data.payload.width, height: data.payload.height } })
          );
          break;
        case 'UPDATE_TRANSFORM':
          dispatch(updateElement({ id: data.payload.id, updates: { transform: data.payload.transform } }));
          break;
        case 'UPDATE_ITEM_CONTENT':
          dispatch(updateElement({ id: data.payload.id, updates: { content: data.payload.content } }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, elements]);

  const sendElementsToIframe = useCallback(
    (elements: PageElement[]) => {
      postMessageToIframe({ type: 'RECEIVE_ELEMENTS', payload: { elements } });
    },
    [postMessageToIframe]
  );

  const updateElementInIFrame = useCallback(
    (updates: Record<string, any>) => {
      postMessageToIframe({ type: 'UPDATE_ELEMENT', payload: { updates } });
    },
    [postMessageToIframe]
  );

  const insertElementInIFrame = useCallback(
    (newElement: PageElement) => {
      postMessageToIframe({ type: 'INSERT_ELEMENT', payload: { newElement } });
    },
    [postMessageToIframe]
  );

  const handleSelectionChange = useCallback(
    (id: string) => {
      postMessageToIframe({ type: 'SELECTION_CHANGED', payload: id });
    },
    [postMessageToIframe]
  );

  return { iframeReady, sendElementsToIframe, updateElementInIFrame, insertElementInIFrame, handleSelectionChange };
};
