import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE } from '@shared/constants';
import type { PageElement } from '@shared/typing';
import undoable from 'redux-undo';

interface SelectionState {
  selectedElement: PageElement;
  lastUpdates: Partial<PageElement>;
  lastSelectedSection: string;
}

const initialState: SelectionState = {
  selectedElement: ELEMENTS_TEMPLATE.section,
  lastUpdates: {},
  lastSelectedSection: 'section-1'
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    selectElement: (state, action: PayloadAction<PageElement>) => {
      state.selectedElement = action.payload;
    },
    setLastSelectedSection(state, action: PayloadAction<string>) {
      state.lastSelectedSection = action.payload;
    },
    setSelectLastUpdates(state, action: PayloadAction<Partial<PageElement>>) {
      state.lastUpdates = action.payload;
    },
    updateSelectElement(state, action: PayloadAction<Partial<PageElement>>) {
      Object.assign(state.selectedElement, action.payload);
    },
    clearSelection(state) {
      Object.assign(state, initialState);
    }
  }
});

export const { selectElement, updateSelectElement, setSelectLastUpdates, setLastSelectedSection, clearSelection } =
  selectionSlice.actions;

export default undoable(selectionSlice.reducer);
