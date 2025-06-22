import { createSlice } from '@reduxjs/toolkit';
import { getRandomDuration } from '../../../utils/getRandomDuration';

interface EditorState {
  isLoading: boolean;
  loadingDuration: number;
  targetDownloadSite: { id: string; shouldMinify: boolean };
}

const initialState: EditorState = {
  isLoading: true,
  loadingDuration: getRandomDuration(1.5, 3.5),
  targetDownloadSite: {
    id: '',
    shouldMinify: false
  }
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTargetDownloadSite(state, action) {
      state.targetDownloadSite.id = action.payload.id;
      state.targetDownloadSite.shouldMinify = action.payload.shouldMinify;
    }
  }
});

export const { setIsLoading, setTargetDownloadSite } = editorSlice.actions;

export default editorSlice.reducer;
