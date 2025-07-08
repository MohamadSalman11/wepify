import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PageState {
  width: number;
  height: number;
  originWidth: number;
  originHeight: number;
  scale: number;
  hasSetOriginSize: boolean;
  iframe: HTMLIFrameElement | undefined;
}

const initialState: PageState = {
  width: window.innerWidth,
  height: window.innerHeight,
  originWidth: window.innerWidth,
  originHeight: window.innerHeight,
  scale: 100,
  hasSetOriginSize: false,
  iframe: undefined
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage(state, action) {
      Object.assign(state, action.payload);
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
    setScale(state, action: PayloadAction<number>) {
      state.scale = action.payload;
    }
  }
});

export const { setPage, setWidth, setHeight, setScale } = pageSlice.actions;

export default pageSlice.reducer;
