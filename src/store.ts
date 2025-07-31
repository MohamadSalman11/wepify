import { configureStore } from '@reduxjs/toolkit';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import dashboardReducer from './features/dashboard/slices/dashboardSlice';
import editorReducer from './features/editor/slices/editorSlice';
import pageReducer from './features/editor/slices/pageSlice';

const store = configureStore({
  reducer: {
    page: pageReducer,
    dashboard: dashboardReducer,
    editor: editorReducer
  }
});

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
export default store;
