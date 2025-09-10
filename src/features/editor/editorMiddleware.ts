import { Middleware } from '@reduxjs/toolkit';
import { Site } from '@shared/typing';
import { StorageKey } from '../../constant';
import { AppDispatch } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { debounce } from '../../utils/debounce';
import {
  addElement,
  addPage,
  deleteElement,
  deletePage,
  duplicatePage,
  setPageAsIndex,
  setStoring,
  updateElement,
  updatePage
} from './editorSlice';

const SYNC_ACTIONS = new Set([
  updatePage.type,
  addPage.type,
  duplicatePage.type,
  updateElement.type,
  deletePage.type,
  deleteElement.type,
  addElement.type,
  setPageAsIndex.type
]);

const saveSiteDebounced = debounce(async (site: Site, dispatch: AppDispatch) => {
  await AppStorage.updateObject(StorageKey.Sites, site.id, site);
  dispatch(setStoring(false));
});

const editorMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (SYNC_ACTIONS.has(action.type)) {
    store.dispatch(setStoring(true));

    const state = store.getState();
    const currentSite = state.editor.currentSite;

    if (currentSite) {
      saveSiteDebounced(currentSite, store.dispatch);
    }
  }

  return result;
};

export default editorMiddleware;
