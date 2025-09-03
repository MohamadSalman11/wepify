import { Site } from '@shared/typing';

export const toSiteMetadata = (site: Site) => {
  const pagesCount = Object.keys(site.pages).length;
  let sizeBytes = new Blob([JSON.stringify(site)]).size;

  for (const page of Object.values(site.pages)) {
    for (const el of Object.values(page.elements)) {
      if ('blobId' in el && el.blobId && 'size' in el && typeof el.size === 'number') {
        sizeBytes += el.size;
      }
    }
  }

  return {
    id: site.id,
    name: site.name,
    description: site.description,
    createdAt: site.createdAt,
    lastModified: site.lastModified,
    isStarred: site.isStarred,
    pagesCount,
    sizeKb: Math.round(sizeBytes / 1024)
  };
};
