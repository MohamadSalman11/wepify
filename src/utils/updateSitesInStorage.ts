import { Site } from '@shared/typing';
import { StorageKey } from '../constant';
import { AppStorage } from './appStorage';

export const updateInSitesStorage = async (handler: (sites: Site[]) => Site[]) => {
  const sites: Site[] = (await AppStorage.getItem(StorageKey.Sites)) ?? [];
  const updatedSites = handler(sites);
  await AppStorage.setItem(StorageKey.Sites, updatedSites);
};
