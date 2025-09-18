import { useAppSelector } from '../../../store';
import { selectSitesArray } from '../dashboardSlice';
import SitesView from './SitesView';

/**
 * Constants
 */

const EMPTY_STATE_HOME_SITES = {
  title: 'No sites available',
  info: 'Ready to build your website? Add a new site to get started.'
};

/**
 * Component definition
 */

export default function HomeSites() {
  const sites = useAppSelector(selectSitesArray);

  return <SitesView sites={sites} emptyStateMessages={EMPTY_STATE_HOME_SITES} />;
}
