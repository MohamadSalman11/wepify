import localforage from 'localforage';
import type { StorageKey } from '../constant';

const STORAGE = localforage;

export const AppStorage = {
  async setItem(key: StorageKey, data: any) {
    await STORAGE.setItem(key, data);
  },

  async getItem<T>(key: StorageKey) {
    const item = await STORAGE.getItem(key);

    return item as T;
  },

  async removeItem(key: StorageKey) {
    await STORAGE.removeItem(key);
  }
};
