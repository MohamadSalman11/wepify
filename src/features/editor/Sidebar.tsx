import { LuCloudUpload, LuCodeXml, LuFile, LuLayers3, LuLogOut, LuPlus } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Divider from '../../components/divider';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';

/**
 * Styles
 */

const StyledSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-white);
  border-right: var(--border-base);
  grid-row: 1 / 3;
  padding: 1.6rem 1.2rem 4.8rem 1.2rem;

  ul {
    display: flex;
    row-gap: 3.2rem;
    flex-direction: column;
    align-items: center;
    margin-top: 2.4rem;
    list-style: none;

    li a {
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
        background-color: var(--color-white-3);
      }
    }

    .active {
      background-color: var(--color-white-3);
    }
  }

  & svg:not(nav svg) {
    cursor: pointer;
    margin-top: auto;
    color: var(--color-red);
  }
`;

/**
 * Component definition
 */

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <Divider />
      <nav>
        <ul>
          <li>
            <NavLink to='elements'>
              <Icon icon={LuPlus} />
            </NavLink>
          </li>
          <li>
            <NavLink to='pages'>
              <Icon icon={LuFile} />
            </NavLink>
          </li>
          <li>
            <NavLink to='layers'>
              <Icon icon={LuLayers3} />
            </NavLink>
          </li>
          <li>
            <NavLink to='uploads'>
              <Icon icon={LuCloudUpload} />
            </NavLink>
          </li>
          <li>
            <Icon icon={LuCodeXml} />
          </li>
        </ul>
      </nav>
      <Icon icon={LuLogOut} />
    </StyledSidebar>
  );
}

export default Sidebar;
