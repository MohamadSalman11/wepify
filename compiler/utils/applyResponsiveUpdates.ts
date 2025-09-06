import { Device } from '@shared/constants';
import { DeviceType, PageElement, PageElementStyle, ResponsiveDeviceType } from '@shared/typing';
import { getMergedResponsiveStyle } from './getMergedResponsiveStyle';

const RESPONSIVE_DEVICE: ResponsiveDeviceType[] = [Device.Laptop, Device.Tablet, Device.Smartphone];

export const applyResponsiveUpdates = (element: PageElement, updates: Partial<PageElement>, device: DeviceType) => {
  if (!updates.style) {
    return;
  }

  element.responsive ??= {};
  const typedDevice = device as keyof typeof element.responsive;
  const deviceStyle = (element.responsive[typedDevice] ??= {});
  const mergedStyle = getMergedResponsiveStyle(element.style, element.responsive, device, false);

  for (const [name, value] of Object.entries(updates.style)) {
    const key = name as keyof typeof deviceStyle;

    if (mergedStyle[key] === value) {
      delete deviceStyle[key];
    } else {
      deviceStyle[key] = value as any;
    }
  }

  if (Object.keys(deviceStyle).length === 0) {
    delete element.responsive[typedDevice];
  }

  for (const dev of RESPONSIVE_DEVICE) {
    const style = element.responsive[dev];
    if (!style) continue;

    const mergedParent = getMergedResponsiveStyle(element.style, element.responsive, dev, false);

    for (const key of Object.keys(style) as (keyof PageElementStyle)[]) {
      if (style[key] === mergedParent[key]) {
        delete style[key];
      }
    }

    if (Object.keys(style).length === 0) {
      delete element.responsive[dev];
    }
  }
};
