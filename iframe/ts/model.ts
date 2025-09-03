import { DeviceType } from '@shared/typing';
import type Moveable from 'moveable';

export const state: {
  moveable: Moveable | null;
  target: HTMLElement | null;
  targetName: string | null;
  initRender: boolean;
  scaleFactor: number;
  deviceType: DeviceType;
  lastCopiedEl: HTMLElement | null;
  longPressTimer: ReturnType<typeof setTimeout> | null;
} = {
  moveable: null,
  target: null,
  targetName: null,
  initRender: true,
  scaleFactor: 100,
  deviceType: 'tablet',
  lastCopiedEl: null,
  longPressTimer: null
};

export const initializeState = () => {
  if (state.moveable?.target) {
    state.moveable.target = null;
  }

  state.moveable = null;
  state.target = null;
  state.targetName = null;
  state.initRender = true;
  state.scaleFactor = 100;
  state.deviceType = 'tablet';
  state.longPressTimer = null;
};
