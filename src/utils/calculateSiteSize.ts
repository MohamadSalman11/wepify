export const calculateSiteSize = (site) => {
  let totalSizeBytes = 0;

  site.pages.forEach((page) => {
    const jsonString = JSON.stringify(page.elements);
    const sizeBytes = new TextEncoder().encode(jsonString).length;
    totalSizeBytes += sizeBytes;
  });

  const sizeMB = totalSizeBytes / (1024 * 1024);

  if (sizeMB < 1) {
    const sizeKB = (totalSizeBytes / 1024).toFixed(2);
    return `${sizeKB} KB`;
  } else {
    return `${sizeMB.toFixed(2)} MB`;
  }
};
