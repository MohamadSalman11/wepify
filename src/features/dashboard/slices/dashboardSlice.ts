import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SiteMetadata } from '@shared/typing';

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
  sitesMetadata: SiteMetadata[];
  filters: FilterCriteria;
  filterLabel: string;
  isLoading: boolean;
  isProcessing: boolean;
}

const initialState: DashboardState = {
  sitesMetadata: [],
  filters: {},
  filterLabel: '',
  isLoading: true,
  isProcessing: false
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSites(state, action: PayloadAction<SiteMetadata[]>) {
      state.sitesMetadata = action.payload;
    },
    addSite(state, action: PayloadAction<SiteMetadata>) {
      state.sitesMetadata.push(action.payload);
    },
    deleteSite(state, action: PayloadAction<string>) {
      state.sitesMetadata = state.sitesMetadata.filter((site) => site.id !== action.payload);
    },
    duplicateSite(state, action: PayloadAction<{ id: string; newId: string }>) {
      const site = state.sitesMetadata.find((site) => site.id === action.payload.id);

      if (site) {
        state.sitesMetadata.push({ ...site, id: action.payload.newId });
      }
    },
    updateSiteDetails(state, action: PayloadAction<{ id: string; name: string; description: string }>) {
      const site = state.sitesMetadata.find((site) => site.id === action.payload.id);

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
      const site = state.sitesMetadata.find((site) => site.id === action.payload);

      if (site) {
        site.isStarred = !site.isStarred;
      }
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload;
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
  setIsProcessing
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
