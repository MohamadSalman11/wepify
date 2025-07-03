import { useEffect } from 'react';
import type { StorageKey } from '../constant';
import { AppStorage } from '../utils/appStorage';

type UseLoadFromStorage<T> = {
  storageKey: StorageKey | StorageKey[];
  loadingDuration?: number;
  onLoaded: (data: T | null) => void;
};

export function useLoadFromStorage<T>({ storageKey, loadingDuration = 0, onLoaded }: UseLoadFromStorage<T>) {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function load() {
      let data: T | null = null;

      if (Array.isArray(storageKey)) {
        const entries = await Promise.all(
          storageKey.map(async (key) => [key, (await AppStorage.getItem<T>(key)) as T | null])
        );
        data = Object.fromEntries(entries);
      } else {
        data = (await AppStorage.getItem<T>(storageKey)) as T | null;
      }

      if (loadingDuration > 0) {
        timeoutId = setTimeout(() => onLoaded(data), loadingDuration);
      } else {
        onLoaded(data);
      }
    }

    load();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onLoaded, storageKey, loadingDuration]);
}
