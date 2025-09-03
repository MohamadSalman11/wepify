import { Device } from '@shared/constants';
import { DeviceType, PageElement, PageElementStyle, ResponsiveDeviceType } from '@shared/typing';

const RESPONSIVE_DEVICE: ResponsiveDeviceType[] = [Device.Laptop, Device.Tablet, Device.Smartphone];

export const getMergedResponsiveStyle = (
  baseStyle: PageElementStyle,
  responsive: PageElement['responsive'],
  device: DeviceType
): PageElementStyle => {
  if (device === Device.Monitor) {
    return baseStyle;
  }

  let merged = { ...baseStyle };
  const deviceIndex = RESPONSIVE_DEVICE.indexOf(device as ResponsiveDeviceType);

  for (let i = 0; i <= deviceIndex; i++) {
    const responsiveDevice = RESPONSIVE_DEVICE[i];
    merged = { ...merged, ...responsive?.[responsiveDevice] };
  }

  return merged;
};
