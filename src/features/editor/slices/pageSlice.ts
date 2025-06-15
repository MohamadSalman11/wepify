import { createSlice } from '@reduxjs/toolkit';
import { ELEMENTS_TEMPLATE } from '../../../constant';
import { flattenElements } from '../../../utils/flatten-elements';

const initialState = {
  id: 'site-1-page-1',
  width: window.innerWidth,
  height: window.innerHeight,
  originWidth: window.innerWidth,
  originHeight: window.innerHeight,
  iframe: undefined,
  lastAddedElement: undefined,
  scale: 100,
  elements: [{ ...ELEMENTS_TEMPLATE['section'], id: 'section-1' }]
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setWidth(state, action) {
      state.width = action.payload;

      if (state.originWidth === window.innerWidth) state.originWidth = action.payload;
    },
    setHeight(state, action) {
      state.height = action.payload;

      if (state.originWidth === window.innerHeight) state.originHeight = action.payload;
    },
    setScale(state, action) {
      state.scale = action.payload;
    },
    setNewElement(state, action) {
      state.lastAddedElement = action.payload;
    },
    setElements(state, action) {
      state.elements = action.payload;
    },
    addElement(state, action) {
      state.elements.push(action.payload);
    },
    updateElement(state, action) {
      const { id, updates } = action.payload;
      const element = flattenElements(state.elements).find((el) => el.id === id);

      if (element) {
        Object.assign(element, updates);
      }
    },

    setPage(state, action) {
      state.id = action.payload.id;
      state.elements = action.payload.elements;
      state.lastAddedElement = undefined;
    }
  }
});

export const { setWidth, setHeight, setScale, setNewElement, addElement, updateElement, setElements, setPage } =
  pageSlice.actions;

export default pageSlice.reducer;
