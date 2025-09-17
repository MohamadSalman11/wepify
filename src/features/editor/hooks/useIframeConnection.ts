import { Device, EditorToIframe, IframeToEditor, SCREEN_SIZES } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import {
  addElement,
  addElements,
  changeElementPosition,
  copyElement,
  deleteElement,
  selectCurrentPage,
  selectCurrentPageElements,
  selectCurrentPageId,
  setCurrentElement,
  setDeviceSimulator,
  setLoading,
  updateElement,
  updatePage
} from '../editorSlice';

export const useIframeConnection = () => {
  const dispatch: AppDispatch = useDispatch();
  const [iframeReady, setIframeReady] = useState(false);
  const pageId = useAppSelector(selectCurrentPageId);
  const elements = useAppSelector(selectCurrentPageElements);
  const dataLoaded = useAppSelector((state) => state.editor.dataLoaded);
  const copiedElement = useAppSelector((state) => state.editor.copiedElement);
  const pageBackgroundColor = useAppSelector(selectCurrentPage).backgroundColor;
  const elementsRef = useRef(elements);
  const backgroundColorRef = useRef(pageBackgroundColor);

  elementsRef.current = elements;

  useEffect(() => {
    backgroundColorRef.current = pageBackgroundColor;
  }, [pageBackgroundColor]);

  const renderPageInIframe = useCallback(() => {
    const { width, height } = SCREEN_SIZES.monitor;
    const deviceSimulator = { type: Device.Monitor, width, height };

    const payload = {
      elements: elementsRef.current,
      deviceSimulator: deviceSimulator,
      backgroundColor: backgroundColorRef.current
    };

    const handlePageRendered = () => {
      setTimeout(() => {
        dispatch(setLoading(false));
        dispatch(setDeviceSimulator(deviceSimulator));
        iframeConnection.send(EditorToIframe.DeviceChanged, { deviceSimulator });
      }, 1000);
    };

    iframeConnection.send(EditorToIframe.RenderPage, payload);
    iframeConnection.on(IframeToEditor.PageRendered, handlePageRendered);
  }, [dispatch]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.IframeReady, () => setIframeReady(true));

    if (iframeReady && dataLoaded) {
      renderPageInIframe();
    }

    return () => iframeConnection.off(IframeToEditor.IframeReady);
  }, [dispatch, renderPageInIframe, dataLoaded, iframeReady, pageId]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.PasteElement, () => {
      iframeConnection.send(EditorToIframe.InsertCopiedElement, copiedElement);
    });
  }, [copiedElement]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.CopyElement, () => dispatch(copyElement()));
    iframeConnection.on(IframeToEditor.SelectElement, (payload) => dispatch(setCurrentElement(payload)));
    iframeConnection.on(IframeToEditor.StoreElement, (payload) => dispatch(addElement(payload)));
    iframeConnection.on(IframeToEditor.StoreElements, (payload) => dispatch(addElements(payload)));
    iframeConnection.on(IframeToEditor.StoreElement, (payload) => dispatch(addElement(payload)));
    iframeConnection.on(IframeToEditor.ElementPositionChanged, (payload) => dispatch(changeElementPosition(payload)));
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
