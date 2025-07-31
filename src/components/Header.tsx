import { LuRocket } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Breakpoint, Path } from '../constant';
import Button from './Button';
import Icon from './Icon';
import Logo from './Logo';

/**
 * Component definition
 */

export default function Header() {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <Container>
        <LeftSection>
          <Icon icon={LuRocket} color='var(--color-primary)' fill />
          Build fast
        </LeftSection>
        <LogoWrapper>
          <Logo withText onClick={() => navigate(Path.Home)} />
        </LogoWrapper>
        <div>
          <Button onClick={() => navigate(Path.Dashboard)} variation='outline'>
            Get Started
          </Button>
        </div>
      </Container>
    </StyledHeader>
  );
}

/**
 * Styles
 */

const StyledHeader = styled.header`
  margin: 4.8rem;

  @media (max-width: ${Breakpoint.TabPort}em) {
    margin: 0;
  }
`;

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-white);
  padding: 1.6rem 2.4rem;
  max-width: 120rem;

  @media (max-width: ${Breakpoint.TabPort}em) {
    border-radius: 0;
    width: 100%;
  }

  @media (max-width: ${Breakpoint.Phone}em) {
    padding: 1.6rem 1.2rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.8rem;
  font-size: 1.4rem;
  color: var(--color-primary);
  user-select: none;
`;

const LogoWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: ${Breakpoint.TabPort}em) {
    span {
      display: none;
    }
  }
`;
