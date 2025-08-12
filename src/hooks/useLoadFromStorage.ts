import { useEffect } from 'react';
import type { StorageKey } from '../constant';
import { AppStorage } from '../utils/appStorage';

const DEFAULT_DELAY = 2000;

type UseLoadFromStorageProps<T> = {
  storageKey: StorageKey | StorageKey[];
  delay?: number;
  onLoaded: (data: T | null) => void;
};

export const useLoadFromStorage = <T>({ storageKey, delay = DEFAULT_DELAY, onLoaded }: UseLoadFromStorageProps<T>) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const load = async () => {
      let data: T | null = null;

      if (Array.isArray(storageKey)) {
        const entries = await Promise.all(
          storageKey.map(async (key) => [key, (await AppStorage.getItem<T>(key)) as T | null])
        );
        data = Object.fromEntries(entries);
      } else {
        data = (await AppStorage.getItem<T>(storageKey)) as T | null;
      }

      timeoutId = setTimeout(() => {
        onLoaded(data);
      }, delay);
    };

    load();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onLoaded, storageKey, delay]);
};
