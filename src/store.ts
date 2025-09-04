import { configureStore } from '@reduxjs/toolkit';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import dashboardMiddleware from './features/dashboard/dashboardMiddleware';
import dashboardReducer from './features/dashboard/dashboardSlice';
import editorMiddleware from './features/editor/editorMiddleware';
import editorReducer from './features/editor/editorSlice';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    editor: editorReducer
  },
  middleware: (getDefaultMiddleware) =>
    [...getDefaultMiddleware(), editorMiddleware, dashboardMiddleware] as ReturnType<typeof getDefaultMiddleware>
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
export default store;
