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
  setLoading,
  updateElement,
  updatePage
} from '../editorSlice';

export const useIframeConnection = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentPageId = useAppSelector(selectCurrentPageId);
  const elements = useAppSelector(selectCurrentPageElements);
  const deviceSimulator = useAppSelector((state) => state.editor.deviceSimulator);
  const copiedElement = useAppSelector((state) => state.editor.copiedElement);
  const pageBackgroundColor = useAppSelector(selectCurrentPage).backgroundColor;
  const hasMounted = useRef(false);
  const elementsRef = useRef(elements);

  elementsRef.current = elements;

  const renderPageInIframe = useCallback(() => {
    const payload = { elements: elementsRef.current, deviceSimulator, backgroundColor: pageBackgroundColor };

    const handlePageRendered = () => {
      setTimeout(() => {
        dispatch(setLoading(false));
        iframeConnection.send(EditorToIframe.DeviceChanged, { deviceSimulator });
      }, 1000);
    };

    iframeConnection.send(EditorToIframe.RenderPage, payload);
    iframeConnection.on(IframeToEditor.PageRendered, handlePageRendered);
  }, [dispatch, deviceSimulator, pageBackgroundColor]);

  useEffect(() => {
    iframeConnection.on(IframeToEditor.IframeReady, renderPageInIframe);

    return () => iframeConnection.off(IframeToEditor.IframeReady);
  }, [renderPageInIframe]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    renderPageInIframe();
  }, [renderPageInIframe, currentPageId]);

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
      dispatch(updatePage({ id: currentPageId as string, updates: payload }));
    });

    return () => {
      iframeConnection.off(IframeToEditor.CopyElement);
      iframeConnection.off(IframeToEditor.SelectElement);
      iframeConnection.off(IframeToEditor.StoreElement);
      iframeConnection.off(IframeToEditor.UpdateElement);
      iframeConnection.off(IframeToEditor.DeleteElement);
      iframeConnection.off(IframeToEditor.PageUpdated);
    };
  }, [dispatch, currentPageId]);
};
