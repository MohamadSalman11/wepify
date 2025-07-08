import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ElementNames } from '@shared/constants';
import type { PageElement, Site, SitePage } from '@shared/types';
import { findElementById } from '../../../utils/findElementById';

interface EditorState {
  site: Site;
  isLoading: boolean;
  isError: boolean;
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
  isError: false,
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
    setIsError(state, action) {
      state.isError = action.payload;
    },
    setImages(state, action) {
      state.images = action.payload;
    },
    addElement(
      state,
      action: PayloadAction<{
        pageId: string;
        parentElementId: string;
        newElement: PageElement;
      }>
    ) {
      const { pageId, parentElementId, newElement } = action.payload;

      const page = state.site.pages.find((p) => p.id === pageId);
      if (!page) return;

      if (newElement.name === ElementNames.Section) {
        page.elements.push(newElement);
        return;
      }

      const parentEl = findElementById(parentElementId, page.elements);
      if (!parentEl) return;

      parentEl.children?.push(newElement);
    },
    updateElementInSite(
      state,
      action: PayloadAction<{
        pageId: string;
        elementId: string;
        updates: Partial<PageElement>;
      }>
    ) {
      const { pageId, elementId, updates } = action.payload;

      const page = state.site.pages.find((p) => p.id === pageId);
      if (!page) return;

      const element = findElementById(elementId, page.elements);
      if (!element) return;

      Object.assign(element, updates);
    },
    deleteElementInSite(
      state,
      action: PayloadAction<{
        pageId: string;
        parentElementId: string;
        elementId: string;
      }>
    ) {
      const { pageId, parentElementId, elementId } = action.payload;

      const page = state.site.pages.find((p) => p.id === pageId);
      if (!page) return;

      const parentEl = findElementById(parentElementId, page.elements);

      if (!parentEl) {
        page.elements = page.elements.filter((el) => el.id !== elementId);
        return;
      }

      if (!parentEl.children) return;

      parentEl.children = parentEl.children.filter((el) => el.id !== elementId);
    }
  }
});

export const {
  setSite,
  addPage,
  updatePageInfo,
  deletePage,
  setIsIndexPage,
  setIsLoading,
  setIsError,
  setImages,
  addElement,
  updateElementInSite,
  deleteElementInSite
} = editorSlice.actions;

export default editorSlice.reducer;
