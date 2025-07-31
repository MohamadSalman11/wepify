import { PAGE_PADDING_X } from '@shared/constants';
import { DeviceType } from '@shared/typing';
import { state } from '../model';

export const getScreenBreakpoint = (): DeviceType => {
  const iframeRoot = document.querySelector('#iframe-root');

  if (!iframeRoot) return state.deviceType;

  const width =
    iframeRoot.clientWidth - (import.meta.env.MODE === 'development' && !state.isSitePreviewMode ? PAGE_PADDING_X : 0);

  if (width >= 1920) return 'monitor';
  if (width >= 1280) return 'laptop';
  if (width >= 768) return 'tablet';

  return 'smartphone';
};
