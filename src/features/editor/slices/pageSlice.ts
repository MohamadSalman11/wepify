import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  width: undefined,
  height: undefined,
  elements: [
    {
      id: 'section-1',
      tag: 'section',
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      classes: 'bg-blue-500'
    }
  ]
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setWidth(state, action) {
      state.width = action.payload;
    },
    setHeight(state, action) {
      state.height = action.payload;
    },
    addElement(state, action) {
      state.elements.push(action.payload);
    },
    updateElement(state, action) {
      const { id, updates } = action.payload;
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        Object.assign(element, updates);
      }
    }
  }
});

export const { setWidth, setHeight, addElement, updateElement } = pageSlice.actions;

export default pageSlice.reducer;
