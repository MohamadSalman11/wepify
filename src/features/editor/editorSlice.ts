import { applyResponsiveUpdates } from '@compiler/utils/applyResponsiveUpdates';
import { cleanElement } from '@compiler/utils/cleanElement';
import {
  createAsyncThunk,
  createSelector,
  createSelectorCreator,
  createSlice,
  lruMemoize,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { Device, ElementsName, SCREEN_SIZES } from '@shared/constants';
import { DeviceSimulator, Page, PageElement, Site } from '@shared/typing';
import { StorageKey } from '../../constant';
import { RootState } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { mapBlobsToElements } from '../../utils/mapBlobsToElements';

interface EditorState {
  currentSite: Site | null;
  currentPageId: string | null;
  currentElementId: string;
  copiedElement: PageElement[];
  loading: boolean;
  storing: boolean;
  dataLoaded: boolean;
  iframeReady: boolean;
  error?: string;
  deviceSimulator: DeviceSimulator;
}

const EMPTY_ELEMENT: PageElement = {
  id: '',
  parentId: '',
  tag: '',
  name: ElementsName.Section,
  contentEditable: false,
  focusable: false,
  moveable: false,
  canHaveChildren: true,
  style: {}
};

const EMPTY_PAGE: Page = {
  id: '',
  name: '',
  title: '',
  elements: {},
  isIndex: false,
  backgroundColor: ''
};

export const EMPTY_SITE: Site = {
  id: '',
  name: '',
  description: '',
  createdAt: Date.now(),
  lastModified: Date.now(),
  isStarred: false,
  pages: {}
};

const initialState: EditorState = {
  currentSite: null,
  currentPageId: null,
  currentElementId: '',
  copiedElement: [],
  loading: true,
  storing: false,
  dataLoaded: false,
  iframeReady: false,
  error: undefined,
  deviceSimulator: { type: Device.Monitor, width: SCREEN_SIZES.monitor.width, height: SCREEN_SIZES.monitor.height }
};

export const loadSiteFromStorage = createAsyncThunk(
  'editor/loadSiteFromStorage',
  async ({ siteId, pageId }: { siteId: string; pageId: string }, { rejectWithValue }) => {
    const sites = await AppStorage.get<Record<string, Site>>(StorageKey.Sites);

    if (!sites || !sites[siteId]) {
      return rejectWithValue('This site could not be found. It may have been deleted or not created yet.');
    }

    const site = sites[siteId];
    const currentPage = site.pages[pageId];
    const storedImages = await AppStorage.get<Record<string, File>>(StorageKey.Images, {});

    mapBlobsToElements(currentPage.elements, storedImages);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { site, pageId };
  }
);

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectPage(state, action: PayloadAction<string>) {
      if (state.currentSite && state.currentSite.pages[action.payload]) {
        state.currentPageId = action.payload;
      }
    },
    updatePage(state, action: PayloadAction<{ id: string; updates: Partial<Page> }>) {
      if (!state.currentSite) return;

      const pageId = action.payload.id;
      const updates = action.payload.updates || {};

      const existingPage = state.currentSite.pages[pageId];
      if (!existingPage) return;

      state.currentSite.pages[pageId] = {
        ...existingPage,
        ...updates
      };
    },
    addPage(state, action: PayloadAction<Page>) {
      if (!state.currentSite) return;

      const page = action.payload;
      state.currentSite.pages[page.id] = page;
    },
    duplicatePage(state, action: PayloadAction<{ id: string; newName: string; newTitle: string }>) {
      if (!state.currentSite || !action.payload.id) return;

      const { id, newName, newTitle } = action.payload;
      const pageToDuplicate = state.currentSite.pages[id];

      if (!pageToDuplicate) return;

      const newId = nanoid();

      const duplicatedPage: Page = {
        ...pageToDuplicate,
        id: newId,
        name: newName,
        title: newTitle,
        isIndex: false
      };

      state.currentSite.pages[newId] = duplicatedPage;
    },
    deletePage(state, action: PayloadAction<{ id: string; nextPageId: string }>) {
      const { id, nextPageId } = action.payload;

      if (!state.currentSite || !state.currentSite.pages[id]) return;

      state.currentPageId = nextPageId;
      delete state.currentSite.pages[id];
    },
    addElement(state, action: PayloadAction<PageElement>) {
      if (!state.currentSite || !state.currentPageId) return;

      const page = state.currentSite.pages[state.currentPageId];
      const element = action.payload;

      page.elements[element.id] = element;
    },
    setCurrentElement(state, action: PayloadAction<string>) {
      state.currentElementId = action.payload;
    },
    deleteElement(state, action: PayloadAction<string>) {
      if (!state.currentSite || !state.currentPageId) return;

      const deletedElId = action.payload;
      const page = state.currentSite.pages[state.currentPageId];
      const toDelete = new Set<string>([deletedElId]);

      let added = true;

      while (added) {
        added = false;
        for (const [id, el] of Object.entries(page.elements)) {
          const parentId = el.parentId || '';
          if (toDelete.has(parentId) && !toDelete.has(id)) {
            toDelete.add(id);
            added = true;
          }
        }
      }

      for (const id of toDelete) {
        delete page.elements[id];
      }
    },
    updateElement(state, action: PayloadAction<{ id: string; updates: Partial<PageElement> }>) {
      const page = state.currentSite?.pages[state.currentPageId || ''];
      const { id, updates } = action.payload;
      const element = page?.elements[id];
      const device = state.deviceSimulator.type;

      if (!element) return;
      if (updates.content) element.content = updates.content;

      element.attrs = { ...element.attrs, ...updates.attrs };

      if (device === Device.Monitor) element.style = { ...element.style, ...updates.style };

      applyResponsiveUpdates(element, updates, device);
      cleanElement(element);
    },
    changeElementPosition(state, action: PayloadAction<{ newOrder: string[] }>) {
      const page = state.currentSite?.pages[state.currentPageId || ''];
      if (!page) return;

      const { newOrder } = action.payload;

      for (const [i, id] of newOrder.entries()) {
        const el = page.elements[id];
        if (el) {
          el.domIndex = i;
        }
      }
    },
    copyElement(state) {
      const pages = state.currentSite?.pages;
      const currentPageId = state.currentPageId;

      if (!pages || !currentPageId) return;

      const page = pages[currentPageId];
      const copiedElements: PageElement[] = [];
      const copiedParentIds = new Set<string>([state.currentElementId]);

      copiedElements.push(page.elements[state.currentElementId]);

      let added = true;

      while (added) {
        added = false;
        for (const el of Object.values(page.elements)) {
          const parentId = el.parentId || '';
          if (copiedParentIds.has(parentId) && !copiedParentIds.has(el.id)) {
            copiedParentIds.add(el.id);
            copiedElements.push(el);
            added = true;
          }
        }
      }

      state.copiedElement = copiedElements;
    },
    setDeviceSimulator(state, action: PayloadAction<DeviceSimulator>) {
      const { type, width, height } = action.payload;

      state.deviceSimulator.type = type;
      state.deviceSimulator.width = width;
      state.deviceSimulator.height = height;
    },
    setPageAsIndex(state, action: PayloadAction<string>) {
      if (!state.currentSite || !state.currentSite.pages[action.payload]) return;

      for (const page of Object.values(state.currentSite.pages)) {
        page.isIndex = false;
      }

      state.currentSite.pages[action.payload].isIndex = true;
    },
    setStoring(state, action: PayloadAction<boolean>) {
      state.storing = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setIframeReady(state, action) {
      state.iframeReady = action.payload;
    },
    clearError(state) {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSiteFromStorage.pending, (state) => {
        state.dataLoaded = false;
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadSiteFromStorage.fulfilled, (state, action: PayloadAction<{ site: Site; pageId: string }>) => {
        state.currentSite = action.payload.site;
        state.currentPageId = action.payload.pageId;
        state.dataLoaded = true;
      })
      .addCase(loadSiteFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message;
      });
  }
});

const createFieldsBasedSelector = <T>(keys: (keyof T)[]) =>
  createSelectorCreator(lruMemoize, (prev: T[], next: T[]) => {
    if (prev.length !== next.length) return false;

    for (const [i, prevItem] of prev.entries()) {
      const nextItem = next[i];
      for (const key of keys) {
        if (prevItem[key] !== nextItem[key]) return false;
      }
    }

    return true;
  });

export const selectCurrentSite = (state: RootState) => state.editor.currentSite || EMPTY_SITE;
export const selectCurrentPageId = (state: RootState) => state.editor.currentPageId;

export const selectCurrentPage = createSelector([selectCurrentSite, selectCurrentPageId], (site, pageId) => {
  if (!site || !pageId) return EMPTY_PAGE;
  return site.pages[pageId];
});

export const selectCurrentElement = createSelector(
  [selectCurrentPage, (state: RootState) => state.editor.currentElementId],
  (page, elementId) => page?.elements[elementId] ?? (EMPTY_ELEMENT as PageElement)
);

export const selectCurrentPageElements = createSelector([selectCurrentPage], (page) =>
  page ? Object.values(page.elements) : []
);

export const selectCurrentPageElementsTree = createSelector([selectCurrentPageElements], (elements) => {
  const map: Record<string, { id: string; parentId: string; name: string; domIndex: number }[]> = {};

  for (const el of elements) {
    const parent = el.name === ElementsName.Section ? 'root' : el.parentId || 'root';

    if (!map[parent]) map[parent] = [];
    map[parent].push({ id: el.id, parentId: parent, name: el.name, domIndex: el.domIndex ?? 0 });
  }

  return map;
});

export const selectPagesMetadata = createFieldsBasedSelector<Page>(['name', 'title', 'isIndex'])(
  [(state: RootState) => (state.editor.currentSite ? Object.values(state.editor.currentSite.pages) : [])],
  (pages) =>
    pages.map(({ id, name, title, isIndex, backgroundColor }) => ({
      id,
      name,
      title,
      isIndex,
      backgroundColor
    }))
);

export const {
  selectPage,
  updatePage,
  addPage,
  addElement,
  duplicatePage,
  deletePage,
  deleteElement,
  setCurrentElement,
  changeElementPosition,
  updateElement,
  copyElement,
  setDeviceSimulator,
  setPageAsIndex,
  setStoring,
  setLoading,
  setIframeReady,
  clearError
} = editorSlice.actions;
export default editorSlice.reducer;
