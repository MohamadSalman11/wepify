import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE, ElementsName, RESPONSIVE_PROPS } from '@shared/constants';
import { DeviceType, Image, PageElement, PageMetadata, Site, SitePage } from '@shared/typing';
import { findElementById } from '../../../utils/findElementById';

interface EditorState {
  selectedElement: PageElement;
  lastDeletedElement: PageElement | null;
  site: Site;
  pagesMetadata: PageMetadata[];
  isLoading: boolean;
  isError: boolean;
  isDownloadingSite: boolean;
  isStoring: boolean;
  deviceType: DeviceType;
  images: Image[];
}

const initialState: EditorState = {
  selectedElement: ELEMENTS_TEMPLATE.section as PageElement,
  lastDeletedElement: null,
  site: {
    id: '',
    name: '',
    description: '',
    createdAt: Date.now(),
    lastModified: Date.now(),
    isStarred: false,
    pages: []
  },
  pagesMetadata: [],
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
    setLastDeletedElement(state, action: PayloadAction<PageElement | null>) {
      state.lastDeletedElement = action.payload;
    },
    updateSelectElement(state, action: PayloadAction<Partial<PageElement>>) {
      Object.assign(state.selectedElement, action.payload);
    },
    setSite(state, action: PayloadAction<Site>) {
      state.site = action.payload;
    },
    addPage(state, action: PayloadAction<PageMetadata>) {
      const pageMetadata = action.payload;

      state.site.lastModified = Date.now();
      state.site.pages.push({ ...pageMetadata, elements: [ELEMENTS_TEMPLATE.section as PageElement] });
      state.pagesMetadata.push(pageMetadata);
    },
    updatePageInfo(state, action: PayloadAction<{ id: string; name: string; title: string }>) {
      const { id, name, title } = action.payload;

      const page = state.site.pages.find((page) => page.id === id);
      const pageMetadata = state.pagesMetadata.find((page) => page.id === id);

      if (page && pageMetadata) {
        state.site.lastModified = Date.now();
        page.name = name;
        page.title = title;
        pageMetadata.name = name;
        pageMetadata.title = title;
      }
    },
    deletePage(state, action: PayloadAction<string>) {
      state.site.lastModified = Date.now();
      state.site.pages = state.site.pages.filter((page) => page.id !== action.payload);
      state.pagesMetadata = state.pagesMetadata.filter((page) => page.id !== action.payload);
    },
    setPagesMetadata(state, action: PayloadAction<PageMetadata[]>) {
      state.pagesMetadata = action.payload;
    },
    updatePageMetadata(state, action: PayloadAction<PageMetadata>) {
      const updatedPageMetadata = action.payload;
      const pageMetadata = state.pagesMetadata.find((p) => p.id === updatedPageMetadata.id);

      if (pageMetadata) {
        Object.assign(pageMetadata, updatedPageMetadata);
      }
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
      }>
    ) {
      state.site.lastModified = Date.now();

      const { pageId, elementId, updates } = action.payload;
      const page = state.site.pages.find((p) => p.id === pageId);

      if (!page) return;

      const element = findElementById(elementId, page.elements);

      if (!element) return;

      for (const key in updates) {
        const k = key as keyof typeof element;

        if (RESPONSIVE_PROPS.has(k)) {
          if (element[k]) {
            Object.assign(element[k], updates[k]);
          } else {
            (element as any)[k] = updates[k];
          }
        } else {
          (element as any)[k] = updates[k];
        }
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
  setLastDeletedElement,
  addPage,
  updatePageInfo,
  deletePage,
  setPagesMetadata,
  updatePageMetadata,
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
