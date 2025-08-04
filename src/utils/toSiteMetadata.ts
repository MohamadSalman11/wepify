import { Site } from '@shared/typing';
import { calculateSiteSize } from './calculateSiteSize';

export const toSiteMetadata = (site: Site) => {
  return {
    id: site.id,
    name: site.name,
    description: site.description,
    createdAt: site.createdAt,
    lastModified: site.lastModified,
    isStarred: site.isStarred,
    sizeKb: calculateSiteSize(site, 'kb'),
    pagesCount: site.pages.length,
    firstPageId: site.pages[0].id
  };
};
