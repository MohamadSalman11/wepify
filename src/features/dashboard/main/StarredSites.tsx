import { useAppSelector } from '../../../store';
import SitesView from './SitesView';

/**
 * Component definition
 */

export default function StarredSites() {
  const sites = useAppSelector((state) => state.dashboard.sites);
  const starredSites = sites.filter((site) => site.isStarred);

  return <SitesView sites={starredSites} title='Starred' />;
}
