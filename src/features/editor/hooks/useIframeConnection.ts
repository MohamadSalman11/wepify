import { type RefObject, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ElementNames, TARGET_ORIGIN } from '../../../constant';
import type { PageElement } from '../../../types';
import { flattenElements } from '../../../utils/flattenElements';
import { updateElement } from '../slices/pageSlice';
import { selectElement, setLastSelectedSection, updateSelectElement } from '../slices/selectionSlice';

type Message =
  | { type: 'IFRAME_READY' }
  | { type: 'ELEMENT_CLICKED'; payload: { id: string } }
  | { type: 'UPDATE_POSITION'; payload: { id: string; left: number; top: number } }
  | { type: 'UPDATE_SIZE'; payload: { id: string; width: number; height: number } }
  | { type: 'UPDATE_TRANSFORM'; payload: { id: string; transform: string } }
  | { type: 'UPDATE_ITEM_CONTENT'; payload: { id: string; content: string } };

enum MessageType {
  IframeReady = 'IFRAME_READY',
  ElementClicked = 'ELEMENT_CLICKED',
  UpdatePosition = 'UPDATE_POSITION',
  UpdateSize = 'UPDATE_SIZE',
  UpdateTransform = 'UPDATE_TRANSFORM',
  UpdateContent = 'UPDATE_ITEM_CONTENT',
  ReceiveElements = 'RECEIVE_ELEMENTS',
  UpdateElement = 'UPDATE_ELEMENT',
  InsertElement = 'INSERT_ELEMENT',
  DeleteElement = 'DELETE_ELEMENT',
  SelectionChanged = 'SELECTION_CHANGED'
}

export const useIframeConnection = (
  iframeRef: RefObject<HTMLIFrameElement | null>,
  elements: PageElement[],
  isPreview: boolean
) => {
  const dispatch = useDispatch();
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
    const flatElements = flattenElements(elements);

    if (isPreview && iframeRef.current?.contentDocument?.body) {
      iframeRef.current.contentDocument.body.dataset.isPreview = 'true';
    }

    const handleMessage = (event: MessageEvent) => {
      const data: Message = event.data;

      switch (data.type) {
        case MessageType.IframeReady: {
          setIframeReady(true);
          break;
        }

        case MessageType.ElementClicked: {
          const el = flatElements.find((el) => el.id === data.payload.id);

          if (el) dispatch(selectElement(el));
          if (el.name === ElementNames.Section) dispatch(setLastSelectedSection(el.id));
          break;
        }
        case MessageType.UpdatePosition: {
          const { id, top, left } = data.payload;
          const position = { left, top };

          dispatch(updateSelectElement(position));
          dispatch(updateElement({ id, updates: position }));
          break;
        }
        case MessageType.UpdateSize: {
          const { id, width, height } = data.payload;
          const size = { width, height };

          dispatch(updateSelectElement(size));
          dispatch(updateElement({ id, updates: size }));
          break;
        }
        case MessageType.UpdateTransform: {
          const { id, transform } = data.payload;
          dispatch(updateElement({ id, updates: { transform } }));
          break;
        }
        case MessageType.UpdateContent: {
          const { id, content } = data.payload;
          dispatch(updateElement({ id, updates: { content } }));
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, elements, isPreview, iframeRef]);

  const sendElementsToIframe = useCallback(
    (elements: PageElement[]) => {
      postMessageToIframe({ type: MessageType.ReceiveElements, payload: { elements } });
    },
    [postMessageToIframe]
  );

  const updateElementInIFrame = useCallback(
    (updates: Record<string, any>) => {
      postMessageToIframe({ type: MessageType.UpdateElement, payload: { updates } });
    },
    [postMessageToIframe]
  );

  const insertElementInIFrame = useCallback(
    (newElement: PageElement) => {
      postMessageToIframe({ type: MessageType.InsertElement, payload: { newElement } });
    },
    [postMessageToIframe]
  );

  const deleteElementInIframe = useCallback(
    (id: string) => {
      postMessageToIframe({ type: MessageType.DeleteElement, payload: { id } });
    },
    [postMessageToIframe]
  );

  const handleSelectionChange = useCallback(
    (id: string) => {
      postMessageToIframe({ type: MessageType.SelectionChanged, payload: id });
    },
    [postMessageToIframe]
  );

  return {
    iframeReady,
    sendElementsToIframe,
    updateElementInIFrame,
    insertElementInIFrame,
    handleSelectionChange,
    deleteElementInIframe
  };
};
