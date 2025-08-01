import type { Site } from '@shared/typing';

const BYTES_IN_KB = 1024;

type Unit = 'bytes' | 'kb' | 'mb' | 'gb' | 'tb' | 'pb' | 'eb' | 'zb' | 'yb';

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
  const sizePB = sizeTB / BYTES_IN_KB;
  const sizeEB = sizePB / BYTES_IN_KB;
  const sizeZB = sizeEB / BYTES_IN_KB;
  const sizeYB = sizeZB / BYTES_IN_KB;

  switch (unit) {
    case 'kb':
      return sizeKB;
    case 'mb':
      return sizeMB;
    case 'gb':
      return sizeGB;
    case 'tb':
      return sizeTB;
    case 'pb':
      return sizePB;
    case 'eb':
      return sizeEB;
    case 'zb':
      return sizeZB;
    case 'yb':
      return sizeYB;
  }

  if (sizeYB >= 1) return `${sizeYB.toFixed(2)} YB`;
  if (sizeZB >= 1) return `${sizeZB.toFixed(2)} ZB`;
  if (sizeEB >= 1) return `${sizeEB.toFixed(2)} EB`;
  if (sizePB >= 1) return `${sizePB.toFixed(2)} PB`;
  if (sizeTB >= 1) return `${sizeTB.toFixed(2)} TB`;
  if (sizeGB >= 1) return `${sizeGB.toFixed(2)} GB`;
  if (sizeMB >= 1) return `${sizeMB.toFixed(2)} MB`;

  return `${sizeKB.toFixed(2)} KB`;
}

export { calculateSiteSize };
