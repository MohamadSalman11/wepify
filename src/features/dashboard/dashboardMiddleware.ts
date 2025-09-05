import { Middleware } from '@reduxjs/toolkit';
import { Site } from '@shared/typing';
import { StorageKey, ToastMessages } from '../../constant';
import { AppStorage } from '../../utils/appStorage';
import { AppToast } from '../../utils/appToast';
import { deleteSite, duplicateSite, setProcessing, setSiteStarred, updateSite } from './dashboardSlice';

export const ToastMap = {
  [updateSite.type]: () => AppToast.success(ToastMessages.site.updated),
  [deleteSite.type]: () => AppToast.success(ToastMessages.site.deleted),
  [duplicateSite.type]: () => AppToast.success(ToastMessages.site.duplicated)
};

const dashboardMiddleware: Middleware = (store) => (next) => async (action: any) => {
  const result = next(action);
  const actionsToSync = [updateSite.type, deleteSite.type, duplicateSite.type, setSiteStarred.type];

  if (!actionsToSync.includes(action.type)) {
    return result;
  }

  store.dispatch(setProcessing(true));

  if (action.type === updateSite.type) {
    const { siteId, updates } = action.payload;
    await AppStorage.updateObject<Site>(StorageKey.Sites, siteId, updates);
  }

  if (action.type === deleteSite.type) {
    const siteId = action.payload;
    await AppStorage.deleteFromObject<Site>(StorageKey.Sites, siteId);
  }

  if (action.type === duplicateSite.type) {
    const { id, newId } = action.payload;
    const { createdAt, lastModified } = store.getState().dashboard.sites[newId];
    const sitesStorage = await AppStorage.get<Record<string, Site>>(StorageKey.Sites, {});

    if (sitesStorage[id]) {
      await AppStorage.addToObject(StorageKey.Sites, newId, {
        ...sitesStorage[id],
        id: newId,
        createdAt,
        lastModified
      });
    }
  }

  if (action.type === setSiteStarred.type) {
    const { id, isStarred } = action.payload;
    await AppStorage.updateObject<Site>(StorageKey.Sites, id, { isStarred: isStarred });
  }

  setTimeout(() => {
    const toastFn = ToastMap[action.type as keyof typeof ToastMap];

    store.dispatch(setProcessing(false));
    toastFn?.();
  }, 1000);

  return result;
};

export default dashboardMiddleware;
