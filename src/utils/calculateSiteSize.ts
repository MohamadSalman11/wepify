import type { Site } from '../types';

export const calculateSiteSize = (site: Site) => {
  let totalSizeBytes = 0;

  for (const page of site.pages) {
    const jsonString = JSON.stringify(page.elements);
    const sizeBytes = new TextEncoder().encode(jsonString).length;
    totalSizeBytes += sizeBytes;
  }

  const sizeKB = totalSizeBytes / 1024;
  const sizeMB = sizeKB / 1024;
  const sizeGB = sizeMB / 1024;
  const sizeTB = sizeGB / 1024;

  if (sizeTB >= 1) {
    return `${sizeTB.toFixed(2)} TB`;
  } else if (sizeGB >= 1) {
    return `${sizeGB.toFixed(2)} GB`;
  } else if (sizeMB >= 1) {
    return `${sizeMB.toFixed(2)} MB`;
  } else {
    return `${sizeKB.toFixed(2)} KB`;
  }
};
