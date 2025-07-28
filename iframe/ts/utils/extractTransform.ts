export const extractTransform = (transform: string): { left: number; top: number; rotation: number | null } | null => {
  const translateRegex = /translate\(\s*(-?\d+)px\s*,\s*(-?\d+)px\s*\)/;
  const rotateRegex = /rotate\(\s*(-?\d+(?:\.\d+)?)deg\s*\)/;

  const translateMatch = transform.match(translateRegex);
  if (!translateMatch) return null;

  const rotateMatch = transform.match(rotateRegex);

  return {
    left: Number.parseInt(translateMatch[1], 10),
    top: Number.parseInt(translateMatch[2], 10),
    rotation: rotateMatch ? Number(Number.parseFloat(rotateMatch[1])) : null
  };
};
