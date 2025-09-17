import { Device, EditorToIframe, SCREEN_SIZES } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { DeviceType } from '@shared/typing';
import type { IconType } from 'react-icons';
import { BsCloudCheck } from 'react-icons/bs';
import {
  LuEye,
  LuFileCode2,
  LuFileMinus,
  LuLaptop,
  LuMonitor,
  LuRefreshCw,
  LuSmartphone,
  LuTablet,
  LuZoomIn,
  LuZoomOut
} from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Button from '../../components/Button';
import ConfirmNavigation from '../../components/ConfirmNavigation';
import Divider from '../../components/divider';
import Dropdown from '../../components/Dropdown';
import Icon from '../../components/Icon';
import { Breakpoint, EditorPath } from '../../constant';
import SiteExporter from '../../SiteExporter';
import { useAppSelector } from '../../store';
import { selectCurrentPageElements, selectCurrentSite, setDeviceSimulator } from './editorSlice';

/**
 * Constants
 */

const PUBLISH_LINK = 'https://app.netlify.com/drop';

const DEVICES: { icon: IconType; type: DeviceType }[] = [
  {
    icon: LuMonitor,
    type: Device.Monitor
  },
  {
    icon: LuLaptop,
    type: Device.Laptop
  },
  {
    icon: LuTablet,
    type: Device.Tablet
  },
  {
    icon: LuSmartphone,
    type: Device.Smartphone
  }
] as const;

/**
 * Types
 */

type Size = { width: number; height: number };

/**
 * Component definition
 */

export default function Header() {
  const site = useAppSelector(selectCurrentSite);

  return (
    <StyledHeader>
      <DesignInfo>
        <span>{site?.name}</span>
        <p>{site?.description}</p>
      </DesignInfo>
      <DevicePreviewControls />
      <EditorActions />
    </StyledHeader>
  );
}

function DevicePreviewControls() {
  const dispatch = useDispatch();
  const deviceSimulator = useAppSelector((state) => state.editor.deviceSimulator);

  return (
    <StyledDevicePreviewControls>
      {DEVICES.map(({ icon, type }) => (
        <DevicePreviewButton
          key={type}
          icon={icon}
          deviceType={type}
          isActive={deviceSimulator.type === type}
          setActiveDevice={() => dispatch(setDeviceSimulator({ type, ...SCREEN_SIZES[type] }))}
          screenSize={SCREEN_SIZES[type]}
        />
      ))}
    </StyledDevicePreviewControls>
  );
}

function DevicePreviewButton({
  icon,
  screenSize,
  deviceType,
  isActive,
  setActiveDevice
}: {
  icon: IconType;
  screenSize: Size;
  deviceType: DeviceType;
  isActive: boolean;

  setActiveDevice: (device: DeviceType) => void;
}) {
  const dispatch = useDispatch();
  const elements = useAppSelector(selectCurrentPageElements);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();

    const deviceSimulator = { type: deviceType, ...screenSize };

    dispatch(setDeviceSimulator(deviceSimulator));
    setActiveDevice(deviceType);
    iframeConnection.send(EditorToIframe.DeviceChanged, { deviceSimulator, elements });
  };

  return (
    <Icon
      hover
      isActive={isActive}
      borderRadius='md'
      icon={icon}
      tooltipLabel={getDeviceTooltipLabel(deviceType)}
      tooltipSideOffset={10}
      onClick={handleClick}
    />
  );
}

function EditorActions() {
  const navigate = useNavigate();
  const site = useAppSelector(selectCurrentSite);
  const storing = useAppSelector((state) => state.editor.storing);

  const handleSitePreview = () => {
    navigate(EditorPath.Preview);
  };

  return (
    <StyledEditorActions>
      {storing ? <StyledRefreshIcon icon={LuRefreshCw} /> : <StyledCloudIcon icon={BsCloudCheck} fill />}
      <Divider rotate={90} width={30} />
      <ConfirmNavigation onConfirmed={handleSitePreview}>
        <Icon icon={LuEye} hover tooltipLabel='Preview Site' />
      </ConfirmNavigation>
      <Divider rotate={90} width={30} />
      <Icon
        icon={LuZoomIn}
        hover
        tooltipLabel='Zoom In'
        onClick={() => iframeConnection.send(EditorToIframe.ZoomInPage, 0.02)}
      />
      <Icon
        icon={LuZoomOut}
        hover
        tooltipLabel='Zoom Out'
        onClick={() => iframeConnection.send(EditorToIframe.ZoomInPage, -0.02)}
      />
      <Divider rotate={90} width={30} />
      <Dropdown>
        <Dropdown.Open>
          <Button variation='secondary'>Download</Button>
        </Dropdown.Open>
        <Dropdown.Drop>
          <Dropdown.Button icon={LuFileMinus} onClick={() => new SiteExporter(site, true).downloadZip()}>
            Download Minified
          </Dropdown.Button>
          <Dropdown.Button icon={LuFileCode2} onClick={() => new SiteExporter(site, false).downloadZip()}>
            Download Readable
          </Dropdown.Button>
        </Dropdown.Drop>
      </Dropdown>
      <Button asLink href={PUBLISH_LINK} target='_blank'>
        Publish
      </Button>
    </StyledEditorActions>
  );
}

const getDeviceTooltipLabel = (deviceType: DeviceType) => {
  switch (deviceType) {
    case Device.Monitor:
      return 'Edit for Desktop version';
    case Device.Laptop:
      return 'Edit for Laptop version';
    case Device.Tablet:
      return 'Edit for Tablet version';
    case Device.Smartphone:
      return 'Edit for Smartphone version';
    default:
      return 'Edit view';
  }
};

/**
 * Styles
 */

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-column: 2 / 5;
  column-gap: 4.8rem;
  padding: 0.8rem 3.2rem;
  border-bottom: var(--border-base);
  background-color: var(--color-white);

  & > div {
    justify-content: end;

    &:nth-child(1) {
      width: 30rem;
    }
  }
`;

const StyledDevicePreviewControls = styled.div`
  display: flex;
  column-gap: 4.4rem;
  align-items: center;

  @media (max-width: ${Breakpoint.laptop}em) {
    column-gap: 2.4rem;
  }
`;

const StyledEditorActions = styled.div`
  display: flex;
  column-gap: 1.2rem;
  align-items: center;
`;

const DesignInfo = styled.div`
  user-select: text;

  span {
    font-size: 1.8rem;
  }

  p {
    margin-top: 0.8rem;
    color: var(--color-gray);
    font-size: 1.2rem;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(-360deg);
  }
`;

const StyledRefreshIcon = styled(Icon)`
  animation: ${spin} 1.5s linear infinite;
`;

const StyledCloudIcon = styled(Icon)`
  svg {
    stroke-width: 0.2px;
  }
`;
