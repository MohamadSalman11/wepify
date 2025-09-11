import { Device, SCREEN_SIZES } from '@shared/constants';
import { DeviceSimulator } from '@shared/typing';

export const state: {
  initRender: boolean;
  scaleFactor: number;
  copiedElId: string | null;
  deviceSimulator: DeviceSimulator;
  longPressTimer: ReturnType<typeof setTimeout> | null;
} = {
  initRender: true,
  scaleFactor: 1,
  copiedElId: null,
  deviceSimulator: {
    type: Device.Monitor,
    width: SCREEN_SIZES[Device.Monitor].width,
    height: SCREEN_SIZES[Device.Monitor].height
  },
  longPressTimer: null
};
