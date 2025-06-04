import { useEffect, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElement } from '../slices/pageSlice';
import { selectElement } from '../slices/selectionSlice';

export const useIframeMessaging = (iframeRef: RefObject<HTMLIFrameElement>) => {
  const dispatch = useDispatch();
  const elements = useSelector((state: any) => state.page.elements);
  const selection = useSelector((state: any) => state.selection.selectedElement);

  useEffect(() => {
    if (!iframeRef.current || !selection?.id) {
      return;
    }

    iframeRef.current.contentWindow?.postMessage({ type: 'SELECTION_CHANGED', id: selection.id }, '*');
  }, [iframeRef, selection.id]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      const element = elements.find((el: any) => el.id === data.id);

      if (data.type === 'UPDATE_POSITION') {
        dispatch(updateElement({ id: data.id, updates: { x: data.left, y: data.top } }));
        if (element) dispatch(selectElement(element));
      }

      if (data.type === 'SELECT_ELEMENT') {
        dispatch(selectElement(element));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [elements, dispatch]);
};
