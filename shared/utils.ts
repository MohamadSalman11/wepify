import toast from 'react-hot-toast';

type FieldValidationOptions = {
  value: string;
  emptyMessage: string;
  maxLength?: number;
  maxLengthMessage?: string;
};

export const rgbToHex = (rgb: string) => {
  const result = rgb.match(/\d+/g)?.map(Number);

  if (!result) return rgb;

  return (
    '#' +
    result
      .slice(0, 3)
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
};

export const rgbaToHex = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }) => {
  const hex = [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');

  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${hex}${alphaHex}`;
};

export const generateFileNameFromPageName = (pageName: string): string => {
  return (
    pageName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w_-]/g, '') + '.html'
  );
};

export const isElementName = (name: string | undefined | null, ...names: string[]): boolean =>
  !!name && names.includes(name);

export const validateFields = (fields: FieldValidationOptions[]): boolean => {
  for (const { value, emptyMessage, maxLength, maxLengthMessage } of fields) {
    if (typeof value !== 'string' || value.trim() === '') {
      toast.error(emptyMessage);
      return false;
    }
    if (maxLength !== undefined && value.length > maxLength) {
      toast.error(maxLengthMessage || `Value exceeds ${maxLength} characters.`);
      return false;
    }
  }
  return true;
};
