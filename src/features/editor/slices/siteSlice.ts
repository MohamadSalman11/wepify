import { createSlice } from '@reduxjs/toolkit';
import type { PageElement } from '../../../types';

interface SiteState {
  id: string;
  title: string;
  description: string;
  pages: { id: string; title: string; elements: PageElement[] }[];
}

const initialState: SiteState = {
  id: '',
  title: '',
  description: '',
  pages: []
};

const pageSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {}
});

// export const {} = pageSlice.actions;

export default pageSlice.reducer;
