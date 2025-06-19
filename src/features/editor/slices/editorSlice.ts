import { createSlice } from '@reduxjs/toolkit';
import { getRandomDuration } from '../../../utils/getRandomDuration';

interface EditorState {
  isLoading: boolean;
  loadingDuration: number;
}

const initialState: EditorState = {
  isLoading: true,
  loadingDuration: getRandomDuration(1.5, 3.5)
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    }
  }
});

export const { setIsLoading } = editorSlice.actions;

export default editorSlice.reducer;
