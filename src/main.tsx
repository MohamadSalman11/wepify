import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { initHomeLoadingScreen } from './init-home-loading-screen.ts';
import store from './store.ts';

initHomeLoadingScreen();

const SELECTOR_ROOT_ELEMENT = '#root';

createRoot(document.querySelector(SELECTOR_ROOT_ELEMENT) as HTMLDivElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
