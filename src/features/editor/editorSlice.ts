import { applyResponsiveUpdates } from '@compiler/utils/applyResponsiveUpdates';
import {
  createAsyncThunk,
  createSelector,
  createSelectorCreator,
  createSlice,
  lruMemoize,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { Device, ElementsName, ID_FIRST_SECTION, SCREEN_SIZES } from '@shared/constants';
import { DeviceSimulator, Page, PageElement, Site } from '@shared/typing';
import { StorageKey } from '../../constant';
import { RootState } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { mapBlobsToElements } from '../../utils/mapBlobsToElements';

const EMPTY_ELEMENT: PageElement = {
  id: '',
  parentId: '',
  tag: '',
  name: ElementsName.Section,
  contentEditable: false,
  focusable: false,
  moveable: false,
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

const initialState: EditorState = {
  currentSite: null,
  currentPageId: null,
  currentElementId: ID_FIRST_SECTION,
  copiedElement: [],
  loading: true,
  storing: false,
  error: undefined,
  deviceSimulator: { type: Device.Monitor, width: SCREEN_SIZES.monitor.width, height: SCREEN_SIZES.monitor.height }
};

export const loadSiteFromStorage = createAsyncThunk(
  'editor/loadSiteFromStorage',
  async ({ siteId, pageId }: { siteId: string; pageId: string }) => {
    const sites = await AppStorage.get<Record<string, Site>>(StorageKey.Sites);

    if (!sites || !sites[siteId]) {
      throw new Error('Site not found');
    }

    const site = sites[siteId];
    const currentPage = site.pages[pageId];
    const storedImages = await AppStorage.get<Record<string, Blob>>(StorageKey.Images, {});

    mapBlobsToElements(currentPage.elements, storedImages);

    return { site, pageId };
  }
);

interface EditorState {
  currentSite: Site | null;
  currentPageId: string | null;
  currentElementId: string;
  copiedElement: PageElement[];
  loading: boolean;
  storing: boolean;
  error?: string;
  deviceSimulator: DeviceSimulator;
}

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
      state.currentPageId = page.id;
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
    deletePage(state, action: PayloadAction<string>) {
      if (!state.currentSite || !state.currentSite.pages[action.payload]) return;

      delete state.currentSite.pages[action.payload];
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
    deleteElement(
      state,
      action: PayloadAction<{
        deletedIds: string[];
        updatedIdsMap: Record<string, { newId?: string; parentId?: string }>;
      }>
    ) {
      if (!state.currentSite || !state.currentPageId) return;

      const page = state.currentSite.pages[state.currentPageId];
      const { deletedIds, updatedIdsMap } = action.payload;

      for (const id of deletedIds) {
        delete page.elements[id];
      }

      for (const [oldId, { newId, parentId }] of Object.entries(updatedIdsMap)) {
        const el = page.elements[oldId];
        if (!el) continue;

        if (newId) el.id = newId;
        if (parentId) el.parentId = parentId;

        if (newId) {
          page.elements[newId] = el;
          if (oldId !== newId) delete page.elements[oldId];
        }
      }
    },
    updateElement(state, action: PayloadAction<{ id: string; updates: Partial<PageElement> }>) {
      const page = state.currentSite?.pages[state.currentPageId || ''];
      const { id, updates } = action.payload;
      const element = page?.elements[id];
      const device = state.deviceSimulator.type;

      if (!element) {
        return;
      }

      element.attrs = { ...element.attrs, ...updates.attrs };

      if (device === Device.Monitor) {
        element.style = { ...element.style, ...updates.style };
      }

      applyResponsiveUpdates(element, updates, device);
    },
    copyElement(state) {
      const pages = state.currentSite?.pages;
      const currentPageId = state.currentPageId;

      if (!pages || !currentPageId) {
        return;
      }

      const page = pages[currentPageId];
      const copiedParentIds = new Set<string>();

      const copiedElements = Object.values(page.elements).filter((element) => {
        const parentId = element.parentId || '';

        if (copiedParentIds.has(parentId) || element.id === state.currentElementId) {
          copiedParentIds.add(element.id);
          return true;
        }

        return false;
      });

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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSiteFromStorage.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadSiteFromStorage.fulfilled, (state, action: PayloadAction<{ site: Site; pageId: string }>) => {
        state.loading = false;
        state.currentSite = action.payload.site;
        state.currentPageId = action.payload.pageId;
      })
      .addCase(loadSiteFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

const createLengthBasedSelector = createSelectorCreator(
  lruMemoize,
  (prev: any[], next: any[]) => prev.length === next.length
);

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

export const selectCurrentSite = (state: RootState) => state.editor.currentSite;
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

export const selectCurrentPageElementsTree = createLengthBasedSelector([selectCurrentPageElements], (elements) => {
  const map: Record<string, { id: string; parentId: string; name: string }[]> = {};

  for (const el of elements) {
    const parent = el.name === ElementsName.Section ? 'root' : el.parentId || 'root';

    if (!map[parent]) map[parent] = [];
    map[parent].push({ id: el.id, parentId: parent, name: el.name });
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
  updateElement,
  copyElement,
  setDeviceSimulator,
  setPageAsIndex,
  setStoring
} = editorSlice.actions;
export default editorSlice.reducer;
