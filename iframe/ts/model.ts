import { DeviceType } from '@shared/typing';
import type Moveable from 'moveable';

export const state: {
  moveable: Moveable | null;
  target: HTMLElement | null;
  targetName: string | null;
  initRender: boolean;
  isSitePreviewMode: boolean;
  scaleFactor: number;
  deviceType: DeviceType;
  lastCopiedElId: string | null;
  longPressTimer: ReturnType<typeof setTimeout> | null;
} = {
  moveable: null,
  target: null,
  targetName: null,
  initRender: true,
  isSitePreviewMode: false,
  scaleFactor: 100,
  deviceType: 'tablet',
  lastCopiedElId: null,
  longPressTimer: null
};

export const getTarget = (): HTMLElement => {
  if (!state.target) throw new Error('No current target set');
  return state.target;
};

export const getMoveableInstance = (): Moveable => {
  if (!state.moveable) throw new Error('No Moveable instance set');
  return state.moveable;
};

export const changeTarget = (newTarget: HTMLElement, name: string) => {
  state.target = null;
  state.targetName = null;

  if (state.moveable) {
    state.moveable.target = null;
  }

  state.target = newTarget;
  state.targetName = name;
};

export const initializeState = () => {
  state.moveable = null;
  state.target = null;
  state.targetName = null;
  state.initRender = true;
  state.isSitePreviewMode = false;
  state.scaleFactor = 100;
  state.deviceType = 'tablet';
  state.lastCopiedElId = null;
  state.longPressTimer = null;
};
