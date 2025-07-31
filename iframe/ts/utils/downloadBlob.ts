import { ElementsName } from '@shared/constants';

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement(ElementsName.A);
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
