import localforage from 'localforage';
import { useEffect } from 'react';

type UseLoadFromStorage<T> = {
  storageKey: string;
  loadingDuration?: number;
  onLoaded: (data: T | null) => void;
  iframeReady?: boolean;
};

export function useLoadFromStorage<T>({ storageKey, loadingDuration = 0, onLoaded }: UseLoadFromStorage<T>) {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function load() {
      const data = (await localforage.getItem(storageKey)) as T | null;

      if (loadingDuration > 0) {
        timeoutId = setTimeout(() => {
          onLoaded(data);
        }, loadingDuration);
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
