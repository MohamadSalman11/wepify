export const colorToHex = (color: string): string => {
  const result = color.match(/[\d.]+/g)?.map(Number);

  if (!result || result.length < 3) {
    return color;
  }

  const [r, g, b, a] = result;
  const hex = [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');

  if (typeof a === 'number' && !Number.isNaN(a)) {
    const alphaHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0');

    return `#${hex}${alphaHex}`;
  }

  return `#${hex}`;
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
