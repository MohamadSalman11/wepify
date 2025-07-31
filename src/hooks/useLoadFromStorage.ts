import { useEffect } from 'react';
import type { StorageKey } from '../constant';
import { AppStorage } from '../utils/appStorage';

const DEFAULT_LOADING_DURATION = 0;

type UseLoadFromStorage<T> = {
  storageKey: StorageKey | StorageKey[];
  loadingDuration?: number;
  onLoaded: (data: T | null) => void;
};

export const useLoadFromStorage = <T>({
  storageKey,
  loadingDuration = DEFAULT_LOADING_DURATION,
  onLoaded
}: UseLoadFromStorage<T>) => {
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

      if (loadingDuration > DEFAULT_LOADING_DURATION) {
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
};
