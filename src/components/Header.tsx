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
      <div>
        <LeftSection>
          <Icon icon={LuRocket} />
          Build fast
        </LeftSection>
        <Brand onClick={() => navigate(Path.Home)}>
          <Logo />
          <span>Wepify</span>
        </Brand>
        <div>
          <Button onClick={() => navigate(Path.Dashboard)} variation='outline'>
            Get Started
          </Button>
        </div>
      </div>
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

  & > div {
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
      padding: 2.4rem 1.2rem;
    }
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  color: var(--color-gray);
  user-select: none;

  svg {
    color: var(--color-primary);
    font-size: 1.6rem;
    fill: currentColor;
  }
`;

const Brand = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-primary);
  cursor: pointer;
  user-select: none;

  @media (max-width: ${Breakpoint.TabPort}em) {
    span {
      display: none;
    }
  }

  img {
    margin-bottom: 0.4rem;

    @media (max-width: ${Breakpoint.Phone}em) {
      width: 4rem;
      height: 4rem;
    }
  }
`;
