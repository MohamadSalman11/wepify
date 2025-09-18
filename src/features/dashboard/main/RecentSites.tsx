import { useAppSelector } from '../../../store';
import { selectSitesArray } from '../dashboardSlice';
import SitesView from './SitesView';

/**
 * Constants
 */

const EMPTY_STATE_RECENT_SITES = {
  title: 'No recent sites',
  info: 'Your recently accessed sites will appear here for quick access.'
};

/**
 * Component definition
 */

export default function RecentSites() {
  const sites = useAppSelector(selectSitesArray);
  const recentSites = [...sites].sort((a, b) => b.lastModified - a.lastModified);

  return <SitesView sites={recentSites} emptyStateMessages={EMPTY_STATE_RECENT_SITES} />;
}
