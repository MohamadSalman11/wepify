import { configureStore } from '@reduxjs/toolkit';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import dashboardReducer from './features/dashboard/slices/dashboardSlice';
import editorReducer, { editorMiddleware } from './features/editor/slices/editorSlice';
import pageReducer from './features/editor/slices/pageSlice';

const store = configureStore({
  reducer: {
    page: pageReducer,
    dashboard: dashboardReducer,
    editor: editorReducer
  },
  middleware: (getDefaultMiddleware) =>
    [...getDefaultMiddleware(), editorMiddleware] as ReturnType<typeof getDefaultMiddleware>
});

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
export default store;
