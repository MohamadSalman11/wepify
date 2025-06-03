import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './features/editor/slices/pageSlice';
import selectionReducer from './features/editor/slices/selectionSlice';

const store = configureStore({
  reducer: {
    selection: selectionReducer,
    page: pageReducer
  }
});

export default store;
