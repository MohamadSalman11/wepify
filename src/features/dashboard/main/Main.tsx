import styled from 'styled-components';
import SearchBox from './SearchBox';
import SitesView from './SiteView';

/**
 * Styles
 */

const StyledMain = styled.main`
  padding: 2.4rem;
  flex-grow: 1;
  height: 88vh;
  margin-left: 3.2rem;
  border-radius: var(--border-radius-xl);
  background-color: var(--color-white);
  position: relative;
  overflow-y: hidden;
`;

/**
 * Component definition
 */

function Main() {
  return (
    <StyledMain>
      <SearchBox />
      <SitesView />
    </StyledMain>
  );
}

export default Main;
