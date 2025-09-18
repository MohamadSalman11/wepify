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

  async addToObject<T extends Record<string, any>>(
    key: StorageKey,
    id: string,
    value: any,
    options?: { first?: boolean }
  ) {
    const items = (await this.get<T>(key, {} as T)) as Record<string, any>;
    const { first = true } = options || {};

    if (!(id in items)) {
      const newItems = first ? { [id]: value, ...items } : { ...items, [id]: value };

      await this.set(key, newItems as T);
    }
  },
  async updateObject<T extends Record<string, any>>(key: StorageKey, id: string, updates: Partial<T>) {
    const items = (await this.get<Record<string, T>>(key, {})) as Record<string, T>;

    const currentItem = items[id] || ({} as T);
    const newItem = { ...currentItem, ...updates };

    await this.set(key, { ...items, [id]: newItem });
  },

  async deleteFromObject<T extends Record<string, any>>(key: StorageKey, id: string) {
    const items = (await this.get<T>(key, {} as T)) as T;

    if (id in items) {
      delete items[id];
      await this.set(key, items);
    }
  }
};
