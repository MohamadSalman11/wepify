export const state: {
  initRender: boolean;
  scaleFactor: number;
  longPressTimer: ReturnType<typeof setTimeout> | null;
} = {
  initRender: true,
  scaleFactor: 1,
  longPressTimer: null
};
