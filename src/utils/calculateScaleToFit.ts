import { DEFAULT_SCALE_FACTOR, PAGE_PADDING_X } from '@shared/constants';

type Size = { width: number; height: number };

export const calculateScaleToFit = (originSize: Size, screenSize: Size) => {
  if (screenSize.width > originSize.width) {
    const scaleX = originSize.width / (screenSize.width + PAGE_PADDING_X);
    const scale = Math.floor(scaleX * DEFAULT_SCALE_FACTOR);
    return Math.max(scale, 1);
  }

  return DEFAULT_SCALE_FACTOR;
};
