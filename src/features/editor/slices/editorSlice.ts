import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Site, SitePage } from '@shared/types';

interface EditorState {
  site: Site;
  isLoading: boolean;
  targetDownloadSite: { id: string; shouldMinify: boolean };
}

const initialState: EditorState = {
  site: {
    id: '',
    name: '',
    description: '',
    pagesCount: 0,
    createdAt: Date.now(),
    lastModified: Date.now(),
    isStarred: false,
    pages: []
  },
  isLoading: true,
  targetDownloadSite: { id: '', shouldMinify: false }
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setSite(state, action: PayloadAction<Site>) {
      state.site = action.payload;
      state.site.lastModified = Date.now();
    },
    addPage(state, action: PayloadAction<SitePage>) {
      state.site.pages.push(action.payload);
    },
    updatePageInfo(state, action) {
      const page = state.site.pages.find((page) => page.id === action.payload.id);

      if (page) {
        page.name = action.payload.name;
        page.title = action.payload.title;
      }
    },
    deletePage(state, action) {
      state.site.pages = state.site.pages.filter((page) => page.id !== action.payload);
    },
    setIsIndexPage(state, action) {
      state.site.pages.forEach((page) => {
        page.isIndex = page.id === action.payload;
      });
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setTargetDownloadSite(state, action) {
      state.targetDownloadSite.id = action.payload.id;
      state.targetDownloadSite.shouldMinify = action.payload.shouldMinify;
    }
  }
});

export const { setSite, addPage, updatePageInfo, deletePage, setIsIndexPage, setIsLoading, setTargetDownloadSite } =
  editorSlice.actions;

export default editorSlice.reducer;
