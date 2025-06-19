import localforage from 'localforage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsLoading, setSites } from '../features/dashboard/slices/dashboardSlice';
import type { Site } from '../types';

export const useLoadSitesFromStorage = (loadingDuration: number) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    async function loadSites() {
      const sites = (await localforage.getItem('sites')) as Site[];
      if (sites) {
        dispatch(setSites(sites));
        timeoutId = setTimeout(() => {
          dispatch(setIsLoading(false));
        }, loadingDuration);
      } else {
        dispatch(setIsLoading(false));
      }
    }

    loadSites();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch, loadingDuration]);
};
