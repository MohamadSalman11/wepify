export const extractTransform = (transform: string) => {
  const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
  const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/);

  return {
    left: translateMatch ? Number.parseFloat(translateMatch[1]) : null,
    top: translateMatch ? Number.parseFloat(translateMatch[2]) : null,
    rotate: rotateMatch ? Number.parseFloat(rotateMatch[1]) : null
  };
};
