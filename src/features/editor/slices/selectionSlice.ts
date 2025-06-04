import { createSlice } from '@reduxjs/toolkit';

const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    selectedElement: {}
  },
  reducers: {
    selectElement: (state, action) => {
      state.selectedElement = action.payload;
    },
    updateSelectElement(state, action) {
      const { updates } = action.payload;

      Object.assign(state.selectedElement, updates);
    },
    clearSelection: (state) => {
      state.selectedElement = {};
    }
  }
});

export const { selectElement, updateSelectElement, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
