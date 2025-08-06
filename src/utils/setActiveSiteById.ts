import { Site } from '@shared/typing';
import { StorageKey } from '../constant';
import { AppStorage } from './appStorage';

export const setActiveSiteById = async (id: string) => {
  const sites = (await AppStorage.getItem(StorageKey.Sites)) as Site[];
  const site = sites.find((s) => s.id === id);
  await AppStorage.setItem(StorageKey.Site, site);
};
