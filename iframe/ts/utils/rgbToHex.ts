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
