import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../components/Logo';
import { Path } from '../../constant';

/**
 * Styles
 */

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 2rem;
  cursor: pointer;

  img {
    margin-bottom: 0.4rem;
  }
`;

/**
 * Component definition
 */

function Header() {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <LogoBox onClick={() => navigate(Path.Home)}>
        <Logo />
        <span>Wepify</span>
      </LogoBox>
    </StyledHeader>
  );
}

export default Header;
