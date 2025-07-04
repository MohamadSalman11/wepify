import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Site } from '@shared/types';

export interface FilterCriteria {
  sizeRange?: {
    min: number;
    max: number;
  };
  pageRange?: {
    min: number;
    max: number;
  };
  modifiedWithinDays?: number;
}

interface DashboardState {
  sites: Site[];
  filters: FilterCriteria;
  filterLabel: string;
  isLoading: boolean;
}

const initialState: DashboardState = {
  sites: [],
  filters: {},
  filterLabel: '',
  isLoading: true
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSites(state, action: PayloadAction<Site[]>) {
      state.sites = action.payload;
    },
    addSite(state, action: PayloadAction<Site>) {
      state.sites.push(action.payload);
    },
    deleteSite(state, action: PayloadAction<string>) {
      state.sites = state.sites.filter((site) => site.id !== action.payload);
    },
    duplicateSite(state, action: PayloadAction<{ id: string; newId: string }>) {
      const site = state.sites.find((site) => site.id === action.payload.id);

      if (site) {
        state.sites.push({ ...site, id: action.payload.newId });
      }
    },
    updateSiteDetails(state, action: PayloadAction<{ id: string; name: string; description: string }>) {
      const site = state.sites.find((site) => site.id === action.payload.id);

      if (site) {
        site.name = action.payload.name;
        site.description = action.payload.description;
      }
    },
    setFilters(state, action: PayloadAction<FilterCriteria>) {
      state.filters = action.payload;
    },
    setFilterLabel(state, action: PayloadAction<string>) {
      state.filterLabel = action.payload;
    },
    toggleSiteStarred(state, action: PayloadAction<string>) {
      const site = state.sites.find((site) => site.id === action.payload);

      if (site) {
        site.isStarred = !site.isStarred;
      }
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setImages(state, action) {
      state.images = action.payload;
    }
  }
});

export const {
  setSites,
  addSite,
  deleteSite,
  duplicateSite,
  updateSiteDetails,
  setFilters,
  setFilterLabel,
  toggleSiteStarred,
  setIsLoading,
  setImages
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
