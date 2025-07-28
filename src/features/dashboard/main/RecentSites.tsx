import { useAppSelector } from '../../../store';
import SitesView from './SitesView';

/**
 * Component definition
 */

export default function RecentSites() {
  const sites = useAppSelector((state) => state.dashboard.sites);
  const recentSites = [...sites].sort((a, b) => b.lastModified - a.lastModified);

  return <SitesView sites={recentSites} title='Recent' />;
}
