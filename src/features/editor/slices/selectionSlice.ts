import { createSlice } from '@reduxjs/toolkit';

const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    selectedElement: {
      id: 'section-1',
      tag: 'section',
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      classes: 'bg-blue-500'
    }
  },
  reducers: {
    selectElement: (state, action) => {
      state.selectedElement = action.payload;
    },
    clearSelection: (state) => {
      state.selectedElement = null;
    }
  }
});

export const { selectElement, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
