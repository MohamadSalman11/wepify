import { DeviceType } from '@shared/typing';

const breakpoints: DeviceType[] = ['smartphone', 'tablet', 'laptop', 'monitor'];

export const getNextBreakpoint = (current: DeviceType): DeviceType | null => {
  const index = breakpoints.indexOf(current);
  if (index === -1 || index === breakpoints.length - 1) return null;
  return breakpoints[index + 1];
};
