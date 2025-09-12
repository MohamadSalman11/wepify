const HOME_PATH = '/';
const MAX_TIMEOUT = 10_000;
const MIN_DISPLAY_TIME = 2000;
const SELECTOR_HOME_LOADING_SCREEN = '.home-loading-screen';

export const initHomeLoadingScreen = () => {
  if (globalThis.location.pathname !== HOME_PATH) return;

  const bodyEl = document.body;
  const htmlEl = document.documentElement;
  const loader = document.querySelector(SELECTOR_HOME_LOADING_SCREEN) as HTMLElement | null;

  if (!loader) return;

  loader.classList.add('active');

  const startTime = performance.now();

  bodyEl.style.overflow = 'hidden';

  const hideLoader = () => {
    loader.style.display = 'none';
    bodyEl.style.overflow = '';
    bodyEl.style.paddingRight = '';
    htmlEl.style.scrollbarGutter = '';
  };

  const maxTimeout = setTimeout(hideLoader, MAX_TIMEOUT);

  window.addEventListener('load', () => {
    clearTimeout(maxTimeout);

    const loadTime = performance.now() - startTime;
    const delay = loadTime < MIN_DISPLAY_TIME ? MIN_DISPLAY_TIME : 0;

    setTimeout(hideLoader, delay);
  });
};
