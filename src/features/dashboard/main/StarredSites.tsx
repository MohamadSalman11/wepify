import { useAppSelector } from '../../../store';
import { selectSitesArray } from '../dashboardSlice';
import SitesView from './SitesView';

/**
 * Constants
 */

const EMPTY_STATE_STARRED_SITES = {
  title: 'No starred sites yet',
  info: 'Star your favorite sites to access them quickly here.'
};

/**
 * Component definition
 */

export default function StarredSites() {
  const sites = useAppSelector(selectSitesArray);
  const starredSites = sites.filter((site) => site.isStarred);

  return <SitesView sites={starredSites} title='Starred' emptyStateMessages={EMPTY_STATE_STARRED_SITES} />;
}
