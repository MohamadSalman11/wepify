import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PageElement, Site } from '../../../types';
import { getRandomDuration } from '../../../utils/getRandomDuration';

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
  isModalOpen: boolean;
  isLoading: boolean;
  loadingDuration: number;
}

const initialState: DashboardState = {
  sites: [],
  filters: {},
  filterLabel: '',
  isModalOpen: true,
  isLoading: true,
  loadingDuration: getRandomDuration(1.5, 3.5)
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
    updatePageElements(state, action: PayloadAction<{ siteId: string; pageId: string; elements: PageElement[] }>) {
      const { siteId, pageId, elements } = action.payload;

      const site = state.sites.find((site) => site.id === siteId);
      if (!site) return;

      const page = site.pages.find((page) => page.id === pageId);
      if (!page) return;

      page.elements = elements;
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
    setModalIsOpen(state, action) {
      state.isModalOpen = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setSites,
  addSite,
  deleteSite,
  duplicateSite,
  updateSiteDetails,
  updatePageElements,
  setFilters,
  setFilterLabel,
  toggleSiteStarred,
  setModalIsOpen,
  setIsLoading
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
