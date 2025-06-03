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
    clearSelection: (state) => {
      state.selectedElement = {};
    }
  }
});

export const { selectElement, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
