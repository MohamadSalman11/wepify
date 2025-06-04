import { createSlice } from '@reduxjs/toolkit';

// {
//     id: 'section-2',
//     tag: 'section',
//     width: 100,
//     height: 100,
//     x: 0,
//     y: 300,
//     color: '#fff',
//     backgroundColor: '#1352F1',
//     borderColor: '#000',
//     borderWidth: 5,
//     borderPosition: 'all',
//     content: 'My name is blue',
//     fontFamily: 'Courier-New',
//     fontWeight: 500,
//     fontSize: 20
//   }

const initialState = {
  width: undefined,
  height: undefined,
  originWidth: undefined,
  originHeight: undefined,
  scale: 100,
  elements: []
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setWidth(state, action) {
      state.width = action.payload;

      if (!state.originWidth) state.originWidth = action.payload;
    },
    setHeight(state, action) {
      state.height = action.payload;

      if (!state.originHeight) state.originHeight = action.payload;
    },
    setScale(state, action) {
      state.scale = action.payload;
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

export const { setWidth, setHeight, setScale, addElement, updateElement } = pageSlice.actions;

export default pageSlice.reducer;
