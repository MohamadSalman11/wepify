import { LuRocket } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Path } from '../constant';
import Button from './Button';
import Icon from './Icon';
import Logo from './Logo';

const StyledHeader = styled.header`
  margin: 4.8rem auto;
  width: 120rem;
  background-color: var(--color-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: var(--border-radius-lg);
  padding: 1.6rem 3rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  color: var(--color-gray);
  font-weight: 500;
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

  img {
    margin-bottom: 0.4rem;
  }
`;

function Header() {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <LeftSection>
        <Icon icon={LuRocket} />
        Build fast, launch faster
      </LeftSection>
      <Brand onClick={() => navigate(Path.Home)}>
        <Logo />
        Wepify
      </Brand>
      <div>
        <Button onClick={() => navigate(Path.Dashboard)} variation='outline'>
          Get Started
        </Button>
      </div>
    </StyledHeader>
  );
}

export default Header;
