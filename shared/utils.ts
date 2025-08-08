import toast from 'react-hot-toast';

interface FieldValidationOptions {
  value: string;
  emptyMessage: string;
  maxLength?: number;
  maxLengthMessage?: string;
}

export const isValueIn = (value: string | undefined | null, ...values: string[]): boolean =>
  !!value && values.includes(value);

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

export const hexToRgb = (hex: string) => {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = [...hex].map((c) => c + c).join('');
  }
  const num = Number.parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
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
