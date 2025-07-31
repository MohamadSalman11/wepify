import { DeviceType } from '@shared/typing';

export const getResponsiveValue = <T extends Record<string, any>>(
  values: T | undefined,
  deviceType: DeviceType,
  fallbackDevice: keyof T = 'monitor'
): T[keyof T] | undefined => {
  if (!values) return undefined;

  const value = values?.[deviceType];
  return value ?? values?.[fallbackDevice];
};
