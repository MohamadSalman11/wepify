import { createSlice } from '@reduxjs/toolkit';
import type { PageElement } from '../../types';

interface DashboardState {
  sites: {
    id: string;
    title: string;
    description: string;
    size: number;
    pagesCount: number;
    createdAt: Date;
    lastModified: Date;
    pages: { id: string; title: string; elements: PageElement[] }[];
  }[];
}

const initialState: DashboardState = {
  sites: []
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addSite(state, action) {
      state.sites.push(action.payload);
    },
    deleteSite(state, action) {
      state.sites = state.sites.filter((site) => site.id !== action.payload);
    },
    setSites(state, action) {
      state.sites = action.payload;
    },
    updateSiteInfo(state, action) {
      const site = state.sites.find((site) => site.id === action.payload.id);

      if (site) {
        site.title = action.payload.title;
        site.description = action.payload.description;
      }
    },
    duplicateSite(state, action) {
      const site = state.sites.find((site) => site.id === action.payload.id);

      if (site) {
        state.sites.push({ ...site, id: action.payload.newId });
      }
    },
    updateSite(state, action) {
      const { siteId, pageId, elements } = action.payload;

      const site = state.sites.find((site) => site.id === siteId);
      if (!site) return;

      const page = site.pages.find((page) => page.id === pageId);
      if (!page) return;

      page.elements = elements;
    }
  }
});

export const { setSites, updateSite, addSite, deleteSite, updateSiteInfo, duplicateSite } = dashboardSlice.actions;

export default dashboardSlice.reducer;
