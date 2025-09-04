import { EditorToIframe } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { LuFile, LuImage, LuLayers3, LuLogOut, LuPlus } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ConfirmNavigation from '../../components/ConfirmNavigation';
import Divider from '../../components/divider';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { EditorPath, Path } from '../../constant';
import { useAppSelector } from '../../store';
import { usePanel } from './panels';

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
  const { leftPanelOpen, setLeftPanelOpen } = usePanel();
  const deviceSimulator = useAppSelector((state) => state.editor.deviceSimulator);

  const handleLogout = () => {
    dispatch(setIsLoading(true));
    navigate(Path.Dashboard);
  };

  const handleOpenLeftPanel = () => {
    setLeftPanelOpen(true);
    iframeConnection.send(EditorToIframe.DeviceChanged, { deviceSimulator });
  };

  return (
    <StyledSidebar>
      <Logo />
      <Divider />
      <nav>
        <NavList $leftPanelOpen={leftPanelOpen}>
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
                  onClick={handleOpenLeftPanel}
                />
              </NavLink>
            </li>
          ))}
        </NavList>
      </nav>
      <ConfirmNavigation onConfirmed={handleLogout}>
        <StyledLeaveIcon icon={LuLogOut} color='var(--color-red)' hoverColor='var(--color-red-very-light)' hover />
      </ConfirmNavigation>
    </StyledSidebar>
  );
}

const getTooltipLabel = (to: string) => {
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
};

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

  img {
    margin-bottom: 2rem;
  }
`;

const NavList = styled.ul<{ $leftPanelOpen: boolean }>`
  display: flex;
  row-gap: 3.2rem;
  flex-direction: column;
  align-items: center;
  margin-top: 2.4rem;
  list-style: none;

  li a {
    display: inline-block;
    border-radius: var(--border-radius-md);

    button {
      width: 4rem;
      height: 4rem;
    }
  }

  .active {
    background-color: ${(props) => props.$leftPanelOpen && 'var(--color-white-2)'};
  }
`;

const StyledLeaveIcon = styled(Icon)`
  margin-top: auto;
  width: 4rem;
  height: 4rem;
`;
