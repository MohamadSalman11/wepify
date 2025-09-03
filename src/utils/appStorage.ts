import localforage from 'localforage';
import type { StorageKey } from '../constant';

const STORAGE = localforage;

export const AppStorage = {
  async set<T = any>(key: StorageKey, value: T) {
    await STORAGE.setItem(key, value);
  },

  async get<T = any>(key: StorageKey, defaultValue?: T) {
    const item = await STORAGE.getItem<T>(key);
    return item ?? (defaultValue as T);
  },

  async delete(key: StorageKey) {
    await STORAGE.removeItem(key);
  },

  async addToObject<T extends Record<string, any>>(key: StorageKey, id: string, value: any) {
    const current = (await this.get<T>(key, {} as T)) as Record<string, any>;

    if (!(id in current)) {
      current[id] = value;
      await this.set(key, current as T);
    }
  },

  async updateObject<T extends Record<string, any>>(key: StorageKey, updates: Partial<T>) {
    const current = (await this.get<T>(key, {} as T)) as T;
    await this.set(key, { ...current, ...updates });
  },

  async deleteFromObject<T extends Record<string, any>>(key: StorageKey, id: string) {
    const current = (await this.get<T>(key, {} as T)) as T;
    if (id in current) {
      delete current[id];
      await this.set(key, current);
    }
  }
};
