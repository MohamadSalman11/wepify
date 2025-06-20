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
  lastPageId: string;
}

const initialState: DashboardState = {
  sites: [],
  filters: {},
  filterLabel: '',
  lastPageId: '',
  isModalOpen: true,
  isLoading: true,
  loadingDuration: getRandomDuration(3.5, 5)
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
    addPage(state, action) {
      const { siteId, page } = action.payload;
      const site = state.sites.find((site) => site.id === siteId);
      if (site) {
        site.pages.push(page);
      }
    },
    deleteSite(state, action: PayloadAction<string>) {
      state.sites = state.sites.filter((site) => site.id !== action.payload);
    },
    deletePage(state, action) {
      const site = state.sites.find((site) => site.id === action.payload.siteId);

      if (site) {
        site.pages = site.pages.filter((page) => page.id !== action.payload.pageId);
      }
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
    updatePageName(state, action) {
      const site = state.sites.find((site) => site.id === action.payload.siteId);
      const page = site?.pages.find((page) => page.id === action.payload.pageId);

      if (page) {
        page.name = action.payload.name;
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
  addPage,
  deleteSite,
  deletePage,
  duplicateSite,
  updateSiteDetails,
  updatePageElements,
  updatePageName,
  setFilters,
  setFilterLabel,
  toggleSiteStarred,
  setModalIsOpen,
  setIsLoading
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
