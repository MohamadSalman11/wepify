import type { IconType } from 'react-icons';
import { LuCodeXml, LuFile, LuImage, LuLayers3, LuLogOut, LuPlus } from 'react-icons/lu';
import styled from 'styled-components';
import Logo from '../../components/Logo';

const StyledSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-black-light-2);
  border-right: var(--border-base);
  grid-row: 1 / 3;
  font-size: 2rem;
  padding: 1.6rem 1.2rem 4.8rem 1.2rem;

  ul {
    display: flex;
    row-gap: 3.2rem;
    flex-direction: column;
    align-items: center;
    margin-top: 2.4rem;
    color: var(--color-gray);
    list-style: none;

    li {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      transition: var(--transition-base);
      cursor: pointer;
      border-radius: var(--border-radius-md);
      width: 4rem;
      height: 4rem;

      &::after {
        position: absolute;
        top: 50%;
        transform: translate(5.45rem, -50%);
        opacity: 0;
        transition: var(--transition-base);
        border-radius: var(--border-radius-md);
        background-color: var(--color-primary);
        width: 3px;
        height: 40px;
        content: '';
      }

      &:hover {
        background-color: var(--color-gray-dark-2);
      }

      &:nth-child(1) {
        background-color: var(--color-gray-dark-2);
        color: var(--color-white);
      }
    }
  }

  & svg:not(nav svg) {
    margin-top: auto;
    color: var(--color-red);
  }
`;

const Divider = styled.span`
  margin-top: 1.4rem;
  width: 6rem;
  height: 0.1rem;
  background-color: var(--color-gray-dark-2);
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <Divider />
      <nav>
        <ul>
          <NavItem icon={LuPlus} />
          <NavItem icon={LuFile} />
          <NavItem icon={LuLayers3} />
          <NavItem icon={LuImage} />
          <NavItem icon={LuCodeXml} />
        </ul>
      </nav>
      <LuLogOut />
    </StyledSidebar>
  );
}

function NavItem({ icon: Icon }: { icon: IconType }) {
  return (
    <li>
      <Icon />
    </li>
  );
}

export default Sidebar;
