import { ImageElement, PageElement } from '@shared/typing';

export const mapBlobsToElements = (elements: Record<string, PageElement>, images: Record<string, Blob>): void => {
  for (const el of Object.values(elements)) {
    if ('blobId' in el && typeof el.blobId === 'string') {
      const blob = images[el.blobId];
      if (blob) {
        if ((el as ImageElement).url?.startsWith('blob:')) {
          URL.revokeObjectURL((el as ImageElement).url!);
        }
        (el as ImageElement).url = URL.createObjectURL(blob);
      }
    }
  }
};
