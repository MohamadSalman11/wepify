import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE, ElementsName } from '@shared/constants';
import { DeviceType, Image, PageElement, Site, SitePage } from '@shared/typing';
import { findElementById } from '../../../utils/findElementById';

interface EditorState {
  selectedElement: PageElement;
  site: Site;
  isLoading: boolean;
  isError: boolean;
  isDownloadingSite: boolean;
  isStoring: boolean;
  deviceType: DeviceType;
  images: Image[];
}

const initialState: EditorState = {
  selectedElement: ELEMENTS_TEMPLATE.section as PageElement,
  site: {
    id: '',
    name: '',
    description: '',
    createdAt: Date.now(),
    lastModified: Date.now(),
    isStarred: false,
    pages: []
  },
  isLoading: true,
  isError: false,
  deviceType: 'tablet',
  isDownloadingSite: false,
  isStoring: false,
  images: []
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectElement: (state, action: PayloadAction<PageElement>) => {
      state.selectedElement = action.payload;
    },
    updateSelectElement(state, action: PayloadAction<Partial<PageElement>>) {
      Object.assign(state.selectedElement, action.payload);
    },
    setSite(state, action: PayloadAction<Site>) {
      state.site = action.payload;
    },
    addPage(state, action: PayloadAction<SitePage>) {
      state.site.lastModified = Date.now();
      state.site.pages.push(action.payload);
    },
    updatePageInfo(state, action: PayloadAction<{ id: string; name: string; title: string }>) {
      const page = state.site.pages.find((page) => page.id === action.payload.id);

      if (page) {
        state.site.lastModified = Date.now();
        page.name = action.payload.name;
        page.title = action.payload.title;
      }
    },
    deletePage(state, action: PayloadAction<string>) {
      state.site.lastModified = Date.now();
      state.site.pages = state.site.pages.filter((page) => page.id !== action.payload);
    },
    setIsIndexPage(state, action: PayloadAction<string>) {
      state.site.lastModified = Date.now();

      for (const page of state.site.pages) {
        page.isIndex = page.id === action.payload;
      }
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsError(state, action: PayloadAction<boolean>) {
      state.isError = action.payload;
    },
    setIsStoring(state, action: PayloadAction<boolean>) {
      state.isStoring = action.payload;
    },
    setImages(state, action: PayloadAction<Image[]>) {
      state.images = action.payload;
    },
    addImage(state, action: PayloadAction<Image>) {
      state.site.lastModified = Date.now();
      state.images.push(action.payload);
    },
    deleteImage(state, action: PayloadAction<string>) {
      state.site.lastModified = Date.now();
      state.images = state.images.filter((image) => image.id !== action.payload);
    },
    addElement(
      state,
      action: PayloadAction<{
        pageId: string;
        parentElementId: string;
        newElement: PageElement;
      }>
    ) {
      state.site.lastModified = Date.now();

      const { pageId, parentElementId, newElement } = action.payload;

      const page = state.site.pages.find((p) => p.id === pageId);
      if (!page) return;

      if (newElement.name === ElementsName.Section) {
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
        shouldBeResponsive: boolean;
      }>
    ) {
      state.site.lastModified = Date.now();

      const { pageId, elementId, updates, shouldBeResponsive } = action.payload;

      const page = state.site.pages.find((p) => p.id === pageId);
      if (!page) return;

      const element = findElementById(elementId, page.elements);
      if (!element) return;

      if (shouldBeResponsive) {
        for (const key in updates) {
          const k = key as keyof typeof element;

          if (element[k]) {
            Object.assign(element[k], updates[k]);
          } else {
            (element as any)[k] = updates[k];
          }
        }
      } else {
        Object.assign(element, updates);
      }
    },
    deleteElementInSite(
      state,
      action: PayloadAction<{
        pageId: string;
        parentElementId: string;
        elementId: string;
      }>
    ) {
      state.site.lastModified = Date.now();

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
    },
    updatePageInSite(state, action: PayloadAction<{ id: string; updates: Partial<SitePage> }>) {
      const { id, updates } = action.payload;

      const page = state.site.pages.find((p) => p.id === id);

      if (page) {
        Object.assign(page, updates);
      }
    },
    setIsDownloadingSite(state, action: PayloadAction<boolean>) {
      state.isDownloadingSite = action.payload;
    },
    setDeviceType(state, action: PayloadAction<DeviceType>) {
      state.deviceType = action.payload;
    },
    clearSite() {
      return initialState;
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
  setIsStoring,
  setImages,
  addElement,
  selectElement,
  updateSelectElement,
  updateElementInSite,
  deleteElementInSite,
  deleteImage,
  addImage,
  updatePageInSite,
  setIsDownloadingSite,
  setDeviceType,
  clearSite
} = editorSlice.actions;

export default editorSlice.reducer;
