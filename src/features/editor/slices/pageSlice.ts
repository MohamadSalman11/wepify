import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PageElement, SitePage } from '../../../types';
import { deepDeleteById } from '../../../utils/deepDeleteById';
import { flattenElements } from '../../../utils/flattenElements';

interface PageState extends SitePage {
  width: number;
  height: number;
  originWidth: number;
  originHeight: number;
  scale: number;
  hasSetOriginSize: boolean;
  iframe: HTMLIFrameElement | undefined;
  lastAddedElement: PageElement | undefined;
}

const initialState: PageState = {
  id: '',
  siteId: '',
  name: '',
  siteName: '',
  siteDescription: '',
  width: window.innerWidth,
  height: window.innerHeight,
  originWidth: window.innerWidth,
  originHeight: window.innerHeight,
  scale: 100,
  hasSetOriginSize: false,
  iframe: undefined,
  lastAddedElement: undefined,
  elements: []
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage(
      state,
      action: PayloadAction<{
        id: string;
        siteId: string;
        siteName: string;
        siteDescription: string;
        elements: PageElement[];
      }>
    ) {
      state.siteName = action.payload.siteName;
      state.siteDescription = action.payload.siteDescription;
      state.id = action.payload.id;
      state.siteId = action.payload.siteId;
      state.elements = action.payload.elements;
      state.lastAddedElement = undefined;
    },
    setWidth(state, action: PayloadAction<number>) {
      state.width = action.payload;

      if (!state.hasSetOriginSize) {
        state.originWidth = action.payload;
      }
    },
    setHeight(state, action: PayloadAction<number>) {
      state.height = action.payload;

      if (!state.hasSetOriginSize) {
        state.originHeight = action.payload;
        state.hasSetOriginSize = true;
      }
    },
    setScale(state, action) {
      state.scale = action.payload;
    },
    setElements(state, action: PayloadAction<PageElement[]>) {
      state.elements = action.payload;
    },
    addElement(state, action: PayloadAction<PageElement>) {
      state.elements.push(action.payload);
    },
    updateElement(state, action: PayloadAction<{ id: string; updates: Partial<PageElement> }>) {
      const { id, updates } = action.payload;
      const element = flattenElements(state.elements).find((el) => el.id === id);

      if (element) {
        Object.assign(element, updates);
      }
    },
    deleteElement(state, action: PayloadAction<string>) {
      state.elements = deepDeleteById(state.elements, action.payload);
    },
    setNewElement(state, action: PayloadAction<PageElement>) {
      state.lastAddedElement = action.payload;
    }
  }
});

export const {
  setPage,
  setWidth,
  setHeight,
  setScale,
  setElements,
  addElement,
  updateElement,
  deleteElement,
  setNewElement
} = pageSlice.actions;

export default pageSlice.reducer;
