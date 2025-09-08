import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Site, SiteMetadata } from '@shared/typing';
import { StorageKey } from '../../constant';
import { RootState } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { toSiteMetadata } from '../../utils/toSiteMetadata';

export const loadSitesFromStorage = createAsyncThunk('dashboard/loadSitesFromStorage', async () => {
  const sites = await AppStorage.get<Record<string, Site>>(StorageKey.Sites, {});
  const sitesMetadata: Record<string, SiteMetadata> = {};

  for (const [id, site] of Object.entries(sites)) {
    sitesMetadata[id] = toSiteMetadata(site);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return sitesMetadata;
});

interface DashboardState {
  sites: Record<string, SiteMetadata>;
  loading: boolean;
  processing: boolean;
  error?: string;
}

const initialState: DashboardState = {
  sites: {},
  loading: true,
  processing: false,
  error: undefined
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addSite(state, action: PayloadAction<SiteMetadata>) {
      const site = action.payload;
      state.sites[site.id] = site;
    },
    updateSite(state, action: PayloadAction<{ siteId: string; updates: Partial<SiteMetadata> }>) {
      const { siteId, updates } = action.payload;

      if (state.sites[siteId]) {
        state.sites[siteId] = { ...state.sites[siteId], ...updates };
      }
    },
    deleteSite(state, action: PayloadAction<string>) {
      const siteId = action.payload;
      if (state.sites[siteId]) delete state.sites[siteId];
    },
    duplicateSite(state, action: PayloadAction<{ id: string; newId: string }>) {
      const existing = state.sites[action.payload.id];
      const newId = action.payload.newId;

      if (existing) {
        state.sites[newId] = {
          ...existing,
          id: newId,
          createdAt: Date.now(),
          lastModified: Date.now()
        };
      }
    },
    setSiteStarred(state, action: PayloadAction<{ id: string; isStarred: boolean }>) {
      const { id, isStarred } = action.payload;

      if (state.sites[id]) {
        state.sites[id] = { ...state.sites[id], isStarred };
      }
    },
    setProcessing(state, action: PayloadAction<boolean>) {
      state.processing = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSitesFromStorage.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadSitesFromStorage.fulfilled, (state, action: PayloadAction<Record<string, SiteMetadata>>) => {
        state.loading = false;
        state.sites = action.payload;
      })
      .addCase(loadSitesFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectSitesObject = (state: RootState) => state.dashboard.sites;

export const selectSitesArray = createSelector([selectSitesObject], (sitesObj): SiteMetadata[] =>
  Object.values(sitesObj)
);

export const { addSite, updateSite, deleteSite, duplicateSite, setSiteStarred, setProcessing } = dashboardSlice.actions;
export default dashboardSlice.reducer;
