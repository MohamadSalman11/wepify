const RADIX_DECIMAL = 10;

export const parseGridRepeat = (template: string): { size: number | 'auto'; count: number } => {
  const match = template.match(/repeat\((\d+),\s*([^)]+)\)/);
  if (!match) return { size: 0, count: 0 };
  const [, count, unit] = match;
  return {
    size: unit.includes('fr') ? 'auto' : Number.parseFloat(unit),
    count: Number.parseInt(count, RADIX_DECIMAL)
  };
};
