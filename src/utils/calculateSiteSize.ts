import type { Site } from '@shared/typing';

const BYTES_IN_KB = 1024;

type Unit = 'bytes' | 'kb' | 'mb' | 'gb' | 'tb';

function calculateSiteSize(site: Site | Site[]): string;
function calculateSiteSize(site: Site | Site[], unit: Unit): number;

function calculateSiteSize(site: Site | Site[], unit?: Unit): number | string {
  let totalSizeBytes = 0;
  const sites = Array.isArray(site) ? site : [site];

  for (const s of sites) {
    for (const page of s.pages) {
      const jsonString = JSON.stringify(page.elements);
      const sizeBytes = new TextEncoder().encode(jsonString).length;
      totalSizeBytes += sizeBytes;
    }
  }

  const sizeKB = totalSizeBytes / BYTES_IN_KB;
  const sizeMB = sizeKB / BYTES_IN_KB;
  const sizeGB = sizeMB / BYTES_IN_KB;
  const sizeTB = sizeGB / BYTES_IN_KB;

  switch (unit) {
    case 'bytes':
      return totalSizeBytes;
    case 'kb':
      return sizeKB;
    case 'mb':
      return sizeMB;
    case 'gb':
      return sizeGB;
    case 'tb':
      return sizeTB;
  }

  if (sizeTB >= 1) {
    return `${sizeTB.toFixed(2)} TB`;
  } else if (sizeGB >= 1) {
    return `${sizeGB.toFixed(2)} GB`;
  } else if (sizeMB >= 1) {
    return `${sizeMB.toFixed(2)} MB`;
  } else {
    return `${sizeKB.toFixed(2)} KB`;
  }
}

export { calculateSiteSize };
