import { useAppSelector } from '../../../store';
import SitesView from './SitesView';

/**
 * Component definition
 */

export default function RecentSites() {
  const sitesMetadata = useAppSelector((state) => state.dashboard.sitesMetadata);
  const recentSites = [...sitesMetadata].sort((a, b) => b.lastModified - a.lastModified);

  return <SitesView sitesMetadata={recentSites} title='Recent' />;
}
