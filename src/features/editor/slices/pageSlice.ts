import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  width: undefined,
  height: undefined,
  elements: [
    {
      id: 'section-1',
      tag: 'section',
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      color: '#fff',
      backgroundColor: '#1352F1'
    },
    {
      id: 'section-2',
      tag: 'section',
      width: 100,
      height: 100,
      x: 0,
      y: 300,
      color: '#fff',
      backgroundColor: '#1352F1',
      borderColor: '#000',
      borderWidth: 5,
      borderPosition: 'all',
      content: 'My name is blue',
      fontFamily: 'Courier-New',
      fontWeight: 500,
      fontSize: 20
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
