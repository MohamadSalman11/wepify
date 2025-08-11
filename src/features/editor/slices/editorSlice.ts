import { createSlice, Middleware, type PayloadAction } from '@reduxjs/toolkit';
import { ElementsName, RESPONSIVE_PROPS } from '@shared/constants';
import { DeviceType, Image, PageElement, PageMetadata, Site, SitePage } from '@shared/typing';
import { findElementById } from '../../../utils/findElementById';
import { flattenElements } from '../../../utils/flattenElements';

const STORING_ACTIONS = new Set([
  'addPage',
  'deletePage',
  'duplicatePage',
  'updatePageInfo',
  'setIsIndexPage',
  'addElement',
  'updateElementInSite',
  'deleteElementInSite',
  'updatePageInSite',
  'deleteImage'
]);

interface EditorState {
  selectedElement: PageElement;
  lastDeletedElement: PageElement | null;
  currentPageId: string;
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
  selectedElement: {
    id: '',
    tag: '',
    name: ''
  },
  lastDeletedElement: null,
  currentPageId: '',
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
    addPage(state, action: PayloadAction<SitePage>) {
      const page = action.payload;

      state.site.pages.push(page);

      const { elements: _, ...pageWithoutElements } = page;

      state.pagesMetadata.push(pageWithoutElements);
    },
    updatePageInfo(state, action: PayloadAction<{ id: string; name: string; title: string }>) {
      const { id, name, title } = action.payload;

      const page = state.site.pages.find((page) => page.id === id);
      const pageMetadata = state.pagesMetadata.find((page) => page.id === id);

      if (page && pageMetadata) {
        page.name = name;
        page.title = title;
        pageMetadata.name = name;
        pageMetadata.title = title;
      }
    },
    deletePage(state, action: PayloadAction<string>) {
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
      for (const page of state.site.pages) {
        page.isIndex = page.id === action.payload;
      }

      for (const meta of state.pagesMetadata) {
        meta.isIndex = meta.id === action.payload;
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
      state.images.push(action.payload);
    },
    deleteImage(state, action: PayloadAction<string>) {
      state.images = state.images.filter((image) => image.id !== action.payload);
    },
    addElement(
      state,
      action: PayloadAction<{
        parentElementId: string;
        newElement: PageElement;
      }>
    ) {
      const { parentElementId, newElement } = action.payload;

      const page = state.site.pages.find((p) => p.id === state.currentPageId);
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
        elementId: string;
        updates: Partial<PageElement>;
      }>
    ) {
      const { elementId, updates } = action.payload;
      const page = state.site.pages.find((p) => p.id === state.currentPageId);

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
        parentElementId: string;
        elementId: string;
      }>
    ) {
      const { parentElementId, elementId } = action.payload;

      const page = state.site.pages.find((p) => p.id === state.currentPageId);

      if (!page) return;

      const parentEl = findElementById(parentElementId, page.elements);

      if (!parentEl) {
        page.elements = page.elements.filter((el) => el.id !== elementId);
      } else if (parentEl.children) {
        parentEl.children = parentEl.children.filter((el) => el.id !== elementId);
      }

      let index = 1;
      const flattedElements = flattenElements(page.elements);
      const name = elementId.split('-')[0];
      const sameNameElements = flattedElements.filter((el) => el.name === name);

      for (const el of sameNameElements) {
        el.id = `${name}-${index}`;
        index++;
      }
    },
    updatePageInSite(state, action: PayloadAction<Partial<SitePage>>) {
      const updates = action.payload;

      const page = state.site.pages.find((p) => p.id === state.currentPageId);

      if (page) {
        Object.assign(page, updates);
      }
    },
    setCurrentPageId(state, action: PayloadAction<string>) {
      state.currentPageId = action.payload;
    },
    setIsDownloadingSite(state, action: PayloadAction<boolean>) {
      state.isDownloadingSite = action.payload;
    },
    setDeviceType(state, action: PayloadAction<DeviceType>) {
      state.deviceType = action.payload;
    },
    setSiteLastModified(state, action: PayloadAction<number>) {
      state.site.lastModified = action.payload;
    },
    clearEditor() {
      return initialState;
    },
    clearSelectedElement(state) {
      state.selectedElement = initialState.selectedElement;
    }
  }
});

export const editorMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  const prefix = `${editorSlice.name}/`;
  const actionName = (action as any).type.replace(prefix, '');

  if (STORING_ACTIONS.has(actionName)) {
    storeAPI.dispatch(setIsStoring(true));
    storeAPI.dispatch(setSiteLastModified(Date.now()));
  }

  return result;
};

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
  setCurrentPageId,
  setIsStoring,
  setSiteLastModified,
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
  clearEditor,
  clearSelectedElement
} = editorSlice.actions;

export default editorSlice.reducer;
