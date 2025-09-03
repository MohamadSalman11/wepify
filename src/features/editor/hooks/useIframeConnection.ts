import { EditorToIframe, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import {
  addElement,
  deleteElement,
  selectCurrentPage,
  selectCurrentPageElements,
  selectCurrentPageId,
  setCurrentElement,
  updateElement,
  updatePage
} from '../editorSlice';

export const useIframeConnection = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentPageId = useAppSelector(selectCurrentPageId);
  const elements = useAppSelector(selectCurrentPageElements);
  const deviceSimulator = useAppSelector((state) => state.editor.deviceSimulator);
  const pageBackgroundColor = useAppSelector(selectCurrentPage).backgroundColor;
  const elementsRef = useRef(elements);

  elementsRef.current = elements;

  useEffect(() => {
    const handleIframeReady = () => {
      const payload = { elements: elementsRef.current, deviceSimulator, backgroundColor: pageBackgroundColor };
      iframeConnection.send(EditorToIframe.RenderPage, payload);
    };

    iframeConnection.on(IframeToEditor.IframeReady, handleIframeReady);

    return () => iframeConnection.off(IframeToEditor.IframeReady);
  }, [deviceSimulator, pageBackgroundColor]);

  useEffect(() => {
    const payload = { deviceSimulator, elements: elementsRef.current };
    iframeConnection.send(EditorToIframe.DeviceChanged, payload);

    return () => iframeConnection.off(EditorToIframe.DeviceChanged);
  }, [deviceSimulator]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.SelectElement, (payload) => dispatch(setCurrentElement(payload)));
    iframeConnection.on(IframeToEditor.StoreElement, (payload) => dispatch(addElement(payload)));
    iframeConnection.on(IframeToEditor.UpdateElement, (payload) => dispatch(updateElement(payload)));
    iframeConnection.on(IframeToEditor.DeleteElement, (payload) => dispatch(deleteElement(payload)));

    iframeConnection.on(IframeToEditor.PageUpdated, (payload) =>
      dispatch(updatePage({ id: currentPageId as string, updates: payload }))
    );

    return () => {
      iframeConnection.off(IframeToEditor.SelectElement);
      iframeConnection.off(IframeToEditor.StoreElement);
      iframeConnection.off(IframeToEditor.UpdateElement);
      iframeConnection.off(IframeToEditor.DeleteElement);
      iframeConnection.off(IframeToEditor.PageUpdated);
    };
  }, [dispatch, currentPageId]);
};
