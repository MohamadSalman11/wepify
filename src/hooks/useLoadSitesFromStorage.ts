import localforage from 'localforage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSites } from '../features/dashboard/slices/dashboardSlice';
import type { Site } from '../types';

export const useLoadSitesFromStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadSites() {
      const sites = (await localforage.getItem('sites')) as Site[];
      if (sites) dispatch(setSites(sites));
    }

    loadSites();
  }, [dispatch]);
};
