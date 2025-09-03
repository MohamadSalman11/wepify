import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Divider from '../../components/divider';
import Logo from '../../components/Logo';
import { Path } from '../../constant';
import { useAppSelector } from '../../store';
import { selectSitesArray } from './slices/dashboardSlice';

/**
 * Component definition
 */

export default function Header() {
  const navigate = useNavigate();
  const sites = useAppSelector(selectSitesArray);

  return (
    <StyledHeader>
      <Logo withText onClick={() => navigate(Path.Home)} />
      <HeaderInfo>
        <SiteCountBadge>{sites.length}</SiteCountBadge>
        <Divider rotate={90} width={30} color='var(--color-gray-light-2)' />
        <span>Welcome back 👋</span>
      </HeaderInfo>
    </StyledHeader>
  );
}

/**
 * Styles
 */

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 2.4rem;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.6rem;
  font-size: 1.4rem;
`;

const SiteCountBadge = styled.span`
  border-radius: var(--border-radius-full);
  background-color: var(--color-gray-light-2);
  color: var(--color-white);
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
