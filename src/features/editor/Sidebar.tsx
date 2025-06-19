import { LuCloudUpload, LuCodeXml, LuFile, LuLayers3, LuLogOut, LuPlus } from 'react-icons/lu';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Divider from '../../components/divider';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { Path } from '../../constant';

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
      display: inline-block;
      border-radius: var(--border-radius-md);

      span {
        width: 4rem;
        height: 4rem;
      }

      &:hover {
        background-color: var(--color-white-3);
      }
    }

    .active {
      background-color: var(--color-white-3);
    }
  }
`;

const LeaveButton = styled.button`
  margin-top: auto;
  background-color: transparent;

  span {
    width: 4rem;
    height: 4rem;

    &:hover {
      background-color: var(--color-red-light);
    }
  }

  svg {
    color: var(--color-red);
  }
`;

/**
 * Component definition
 */

function Sidebar() {
  const navigate = useNavigate();

  return (
    <StyledSidebar>
      <Logo />
      <Divider />
      <nav>
        <ul>
          <li>
            <NavLink to='elements'>
              <Icon icon={LuPlus} hover={true} borderRadius='md' />
            </NavLink>
          </li>
          <li>
            <NavLink to='pages'>
              <Icon icon={LuFile} hover={true} borderRadius='md' />
            </NavLink>
          </li>
          <li>
            <NavLink to='layers'>
              <Icon icon={LuLayers3} hover={true} borderRadius='md' />
            </NavLink>
          </li>
          <li>
            <NavLink to='uploads'>
              <Icon icon={LuCloudUpload} hover={true} borderRadius='md' />
            </NavLink>
          </li>
          <li>
            <Icon icon={LuCodeXml} hover={true} borderRadius='md' />
          </li>
        </ul>
      </nav>
      <LeaveButton>
        <Link to={Path.Dashboard}>
          <Icon onClick={() => navigate(Path.Dashboard)} icon={LuLogOut} hover={true} />
        </Link>
      </LeaveButton>
    </StyledSidebar>
  );
}

export default Sidebar;
