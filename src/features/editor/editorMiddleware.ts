import { Middleware } from '@reduxjs/toolkit';
import { Site } from '@shared/typing';
import { StorageKey } from '../../constant';
import { AppStorage } from '../../utils/appStorage';
import { debounce } from '../../utils/debounce';
import {
  addElement,
  addPage,
  deleteElement,
  deletePage,
  duplicatePage,
  setPageAsIndex,
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

const saveSiteDebounced = debounce(async (site: Site) => {
  await AppStorage.updateObject(StorageKey.Sites, { [site.id]: site });
}, 500);

const editorMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (SYNC_ACTIONS.has(action.type)) {
    const state = store.getState();
    const currentSite = state.editor.currentSite;

    if (currentSite) {
      saveSiteDebounced(currentSite);
    }
  }

  return result;
};

export default editorMiddleware;
