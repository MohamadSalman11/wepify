export const extractTransform = (transform: string) => {
  const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
  const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/);
  const scaleMatch = transform.match(/scale\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)/);

  return {
    left: translateMatch ? Number.parseFloat(translateMatch[1]) : 0,
    top: translateMatch ? Number.parseFloat(translateMatch[2]) : 0,
    rotate: rotateMatch ? Number.parseFloat(rotateMatch[1]) : 0,
    scaleX: scaleMatch ? Number.parseFloat(scaleMatch[1]) : 1,
    scaleY: scaleMatch ? Number.parseFloat(scaleMatch[2]) : 1
  };
};
