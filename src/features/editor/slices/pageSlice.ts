import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SitePage } from '@shared/types';

interface PageState {
  width: number;
  height: number;
  originWidth: number;
  originHeight: number;
  scale: number;
  hasSetOriginSize: boolean;
  iframe: HTMLIFrameElement | undefined;
  backgroundColor: string;
}

const initialState: PageState = {
  width: window.innerWidth,
  height: window.innerHeight,
  originWidth: window.innerWidth,
  originHeight: window.innerHeight,
  scale: 100,
  hasSetOriginSize: false,
  iframe: undefined,
  backgroundColor: '#343c44'
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<SitePage>) {
      Object.assign(state, action.payload);
    },
    setSize(
      state,
      action: PayloadAction<{
        width: number;
        height: number;
        originWidth?: number;
        originHeight?: number;
      }>
    ) {
      const { width, height, originWidth, originHeight } = action.payload;

      state.width = width;
      state.height = height;

      if (!state.hasSetOriginSize) {
        state.originWidth = originWidth ?? width;
        state.originHeight = originHeight ?? height;
        state.hasSetOriginSize = true;
      }
    },
    setScale(state, action: PayloadAction<number>) {
      state.scale = action.payload;
    },
    setHasOriginSize(state, action: PayloadAction<boolean>) {
      state.hasSetOriginSize = action.payload;
    },
    setBackground(state, action: PayloadAction<string>) {
      state.backgroundColor = action.payload;
    }
  }
});

export const { setPage, setSize, setScale, setHasOriginSize, setBackground } = pageSlice.actions;

export default pageSlice.reducer;
