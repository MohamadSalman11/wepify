import { LuFile, LuImage, LuLayers3, LuLogOut, LuPlus } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Divider from '../../components/divider';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { EditorPath, Path } from '../../constant';
import { setIsLoading } from '../dashboard/slices/dashboardSlice';
import { clearSelection } from './slices/selectionSlice';

/**
 * Constants
 */

const NAV_ITEMS = [
  { to: EditorPath.Elements, icon: LuPlus },
  { to: EditorPath.Pages, icon: LuFile },
  { to: EditorPath.Layers, icon: LuLayers3 },
  { to: EditorPath.Uploads, icon: LuImage }
];

/**
 * Component definition
 */

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(setIsLoading(true));
    dispatch(clearSelection());
    navigate(Path.Dashboard);
  }

  return (
    <StyledSidebar>
      <Logo />
      <Divider />
      <nav>
        <ul>
          {NAV_ITEMS.map(({ to, icon }, i) => (
            <li key={i}>
              <NavLink to={to}>
                <Icon
                  icon={icon}
                  hover
                  borderRadius='md'
                  tooltipLabel={getTooltipLabel(to)}
                  tooltipSide='right'
                  tooltipSideOffset={10}
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <LeaveButton>
        <Link to={Path.Dashboard}>
          <Icon onClick={handleLogout} icon={LuLogOut} hover={true} />
        </Link>
      </LeaveButton>
    </StyledSidebar>
  );
}

function getTooltipLabel(to: string) {
  switch (to) {
    case EditorPath.Elements:
      return 'Elements';
    case EditorPath.Pages:
      return 'Pages';
    case EditorPath.Layers:
      return 'Layers';
    case EditorPath.Uploads:
      return 'Images';
    default:
      return '';
  }
}

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
