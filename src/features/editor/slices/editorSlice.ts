import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Site, SitePage } from '@shared/types';

interface EditorState {
  site: Site;
  isLoading: boolean;
  images: string[];
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
  images: []
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setSite(state, action: PayloadAction<Site>) {
      state.site = action.payload;
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
    setImages(state, action) {
      state.images = action.payload;
    }
  }
});

export const { setSite, addPage, updatePageInfo, deletePage, setIsIndexPage, setIsLoading, setImages } =
  editorSlice.actions;

export default editorSlice.reducer;
