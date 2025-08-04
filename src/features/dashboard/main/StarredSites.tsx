import { useAppSelector } from '../../../store';
import SitesView from './SitesView';

/**
 * Component definition
 */

export default function StarredSites() {
  const sitesMetadata = useAppSelector((state) => state.dashboard.sitesMetadata);
  const starredSites = sitesMetadata.filter((site) => site.isStarred);

  return <SitesView sitesMetadata={starredSites} title='Starred' />;
}
