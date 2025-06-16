import { configureStore } from '@reduxjs/toolkit';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import dashboardSlice from './features/dashboard/dashboardSlice';
import pageReducer from './features/editor/slices/pageSlice';
import selectionReducer from './features/editor/slices/selectionSlice';

const store = configureStore({
  reducer: {
    selection: selectionReducer,
    page: pageReducer,
    dashboard: dashboardSlice
  }
});

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
export default store;
