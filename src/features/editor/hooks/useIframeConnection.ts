import { EditorToIframe, IframeToEditor } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import {
  addElement,
  copyElement,
  deleteElement,
  selectCurrentPage,
  selectCurrentPageElements,
  selectCurrentPageId,
  setCurrentElement,
  setIframeReady,
  setLoading,
  updateElement,
  updatePage
} from '../editorSlice';

export const useIframeConnection = () => {
  const dispatch: AppDispatch = useDispatch();
  const pageId = useAppSelector(selectCurrentPageId);
  const elements = useAppSelector(selectCurrentPageElements);
  const deviceSimulator = useAppSelector((state) => state.editor.deviceSimulator);
  const dataLoaded = useAppSelector((state) => state.editor.dataLoaded);
  const iframeReady = useAppSelector((state) => state.editor.iframeReady);
  const copiedElement = useAppSelector((state) => state.editor.copiedElement);
  const pageBackgroundColor = useAppSelector(selectCurrentPage).backgroundColor;
  const elementsRef = useRef(elements);
  const deviceSimulatorRef = useRef(deviceSimulator);
  const backgroundColorRef = useRef(pageBackgroundColor);

  elementsRef.current = elements;

  useEffect(() => {
    deviceSimulatorRef.current = deviceSimulator;
  }, [deviceSimulator]);

  useEffect(() => {
    backgroundColorRef.current = pageBackgroundColor;
  }, [pageBackgroundColor]);

  const renderPageInIframe = useCallback(() => {
    const payload = {
      elements: elementsRef.current,
      deviceSimulator: deviceSimulatorRef.current,
      backgroundColor: backgroundColorRef.current
    };

    const handlePageRendered = () => {
      setTimeout(() => {
        dispatch(setLoading(false));
        iframeConnection.send(EditorToIframe.DeviceChanged, { deviceSimulator: deviceSimulatorRef.current });
      }, 1000);
    };

    iframeConnection.send(EditorToIframe.RenderPage, payload);
    iframeConnection.on(IframeToEditor.PageRendered, handlePageRendered);
  }, [dispatch]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.IframeReady, () => dispatch(setIframeReady(true)));

    if (iframeReady && dataLoaded) {
      renderPageInIframe();
    }

    return () => iframeConnection.off(IframeToEditor.IframeReady);
  }, [dispatch, renderPageInIframe, dataLoaded, iframeReady, pageId]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.PasteElement, () => {
      iframeConnection.send(EditorToIframe.InsertElements, copiedElement);
    });
  }, [copiedElement]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.CopyElement, () => dispatch(copyElement()));
    iframeConnection.on(IframeToEditor.SelectElement, (payload) => dispatch(setCurrentElement(payload)));
    iframeConnection.on(IframeToEditor.StoreElement, (payload) => dispatch(addElement(payload)));
    iframeConnection.on(IframeToEditor.UpdateElement, (payload) => dispatch(updateElement(payload)));
    iframeConnection.on(IframeToEditor.DeleteElement, (payload) => dispatch(deleteElement(payload)));

    iframeConnection.on(IframeToEditor.PageUpdated, (payload) => {
      dispatch(updatePage({ id: pageId as string, updates: payload }));
    });

    return () => {
      iframeConnection.off(IframeToEditor.CopyElement);
      iframeConnection.off(IframeToEditor.SelectElement);
      iframeConnection.off(IframeToEditor.StoreElement);
      iframeConnection.off(IframeToEditor.UpdateElement);
      iframeConnection.off(IframeToEditor.DeleteElement);
      iframeConnection.off(IframeToEditor.PageUpdated);
    };
  }, [dispatch, pageId]);
};
