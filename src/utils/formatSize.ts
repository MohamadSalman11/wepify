const BYTES_IN_KB = 1024;

export const formatSize = (sizeInKB: number): string => {
  const units = ['kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
  let size = sizeInKB;
  let unitIndex = 0;

  while (size >= BYTES_IN_KB && unitIndex < units.length - 1) {
    size /= BYTES_IN_KB;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex].toUpperCase()}`;
};
