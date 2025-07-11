import type { Site } from '@shared/types';
import { Tooltip } from 'radix-ui';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  LuEye,
  LuFileCode2,
  LuFileMinus,
  LuLaptop,
  LuMonitor,
  LuRedo2,
  LuSmartphone,
  LuTablet,
  LuUndo2
} from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ActionCreators } from 'redux-undo';
import styled from 'styled-components';
import Button from '../../components/Button';
import Divider from '../../components/divider';
import Dropdown from '../../components/Dropdown';
import Icon from '../../components/Icon';
import { EditorPath, StorageKey } from '../../constant';
import { useIframeContext } from '../../context/IframeContext';
import { useAppSelector } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { setIsDownloadingSite, setIsLoading } from './slices/editorSlice';
import { setHeight, setScale, setWidth } from './slices/pageSlice';

/**
 * Constants
 */

const PUBLISH_LINK = 'https://app.netlify.com/drop';

const SCREEN_SIZES = {
  monitor: { width: 1920 + 120, height: 1080 },
  laptop: { width: 1280 + 120, height: 800 },
  tablet: { width: 768 + 120, height: 1024 },
  smartphone: { width: 375 + 120, height: 667 }
} as const;

/**
 * Types
 */

type Size = { width: number; height: number };
type DeviceType = keyof typeof SCREEN_SIZES | 'auto';

/**
 * Component definition
 */

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { iframeConnection } = useIframeContext();
  const [activeDevice, setActiveDevice] = useState<DeviceType>('auto');
  const { site, isDownloadingSite } = useAppSelector((state) => state.editor);
  const { originWidth, originHeight } = useAppSelector((state) => state.page);

  async function handleDownloadSite(shouldMinify: boolean) {
    dispatch(setIsDownloadingSite(true));
    const site = await AppStorage.getItem<Site>(StorageKey.Site);
    iframeConnection.downloadSite(site, shouldMinify);
  }

  return (
    <StyledHeader>
      <DesignInfo>
        <span>{site.name}</span>
        <p>{site.description}</p>
      </DesignInfo>
      <DevicePreviewControls>
        <DevicePreviewButton
          icon={LuMonitor}
          deviceType='monitor'
          isActive={activeDevice === 'monitor'}
          setActiveDevice={setActiveDevice}
          screenSize={SCREEN_SIZES.monitor}
        />

        <DevicePreviewButton
          icon={LuLaptop}
          deviceType='laptop'
          isActive={activeDevice === 'laptop'}
          setActiveDevice={setActiveDevice}
          screenSize={SCREEN_SIZES.laptop}
        />
        <DevicePreviewButton
          icon={LuTablet}
          deviceType='tablet'
          isActive={activeDevice === 'tablet'}
          setActiveDevice={setActiveDevice}
          screenSize={SCREEN_SIZES.tablet}
        />
        <DevicePreviewButton
          icon={LuSmartphone}
          deviceType='smartphone'
          isActive={activeDevice === 'smartphone'}
          setActiveDevice={setActiveDevice}
          screenSize={SCREEN_SIZES.smartphone}
        />
      </DevicePreviewControls>
      <EditorActions>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icon onClick={() => dispatch(ActionCreators.undo())} icon={LuUndo2} />
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className='TooltipContent' sideOffset={20}>
              Undo
              <Tooltip.Arrow className='TooltipArrow' />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icon onClick={() => dispatch(ActionCreators.redo())} icon={LuRedo2} />
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className='TooltipContent' sideOffset={20}>
              Redo
              <Tooltip.Arrow className='TooltipArrow' />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Divider rotate={90} width={30} />
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icon
              onClick={() => {
                setActiveDevice('auto');
                dispatch(setWidth(originWidth));
                dispatch(setWidth(originHeight));
                dispatch(setScale(100));
                dispatch(setIsLoading(true));
                navigate(EditorPath.Preview, { replace: true });
              }}
              icon={LuEye}
              hover={true}
            />
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className='TooltipContent' sideOffset={20}>
              Preview Site
              <Tooltip.Arrow className='TooltipArrow' />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Divider rotate={90} width={30} />
        <Dropdown>
          <Dropdown.Open>
            <Button variation='secondary' disabled={isDownloadingSite}>
              Download
            </Button>
          </Dropdown.Open>
          <Dropdown.Drop>
            <Dropdown.Button icon={LuFileMinus} onClick={() => handleDownloadSite(true)}>
              Download Minified
            </Dropdown.Button>
            <Dropdown.Button icon={LuFileCode2} onClick={() => handleDownloadSite(false)}>
              Download Readable
            </Dropdown.Button>
          </Dropdown.Drop>
        </Dropdown>
        <Button asLink={true} href={PUBLISH_LINK} target='_blank'>
          Publish
        </Button>
      </EditorActions>
    </StyledHeader>
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
  const { originWidth, originHeight } = useAppSelector((state) => state.page);
  const { iframeConnection } = useIframeContext();

  const setCanvasSize = (size: Size, scaleFactor: number = 100) => {
    iframeConnection.handleViewportChanged(scaleFactor);

    dispatch(setWidth(size.width));
    dispatch(setHeight(size.height));
    dispatch(setScale(scaleFactor));
  };

  const handleClick = () => {
    if (isActive) {
      setActiveDevice('auto');
      setCanvasSize({ width: originWidth, height: originHeight }, 100);
    } else {
      const scaleVal = calculateScaleToFit({ width: originWidth, height: originHeight }, screenSize);
      console.log(scaleVal, screenSize);
      setCanvasSize(screenSize, scaleVal);
      setActiveDevice(deviceType);
    }
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <StyledDevicePreviewButton $active={isActive} onClick={handleClick}>
          <Icon icon={icon} />
        </StyledDevicePreviewButton>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className='TooltipContent' sideOffset={10}>
          {getTooltipLabel(deviceType)}
          <Tooltip.Arrow className='TooltipArrow' />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function calculateScaleToFit(originSize: Size, screenSize: Size) {
  if (screenSize.width > originSize.width) {
    const scaleX = originSize.width / screenSize.width;
    const scaleY = originSize.height / screenSize.height;
    const scale = Math.floor(Math.min(scaleX, scaleY) * 100);
    return Math.max(scale, 10);
  }

  return 100;
}

function getTooltipLabel(deviceType: DeviceType) {
  switch (deviceType) {
    case 'monitor':
      return 'Edit for Desktop version';
    case 'laptop':
      return 'Edit for Laptop version';
    case 'tablet':
      return 'Edit for Tablet version';
    case 'smartphone':
      return 'Edit for Smartphone version';
    default:
      return 'Edit view';
  }
}

/**
 * Styles
 */

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-column: 2 / 5;
  padding: 0.8rem 3.2rem;
  border-bottom: var(--border-base);
  background-color: var(--color-white);

  & > div {
    flex-grow: 1;
    justify-content: end;
  }
`;

const DevicePreviewControls = styled.div`
  display: flex;
  column-gap: 4.8rem;
  align-items: center;
`;

const EditorActions = styled.div`
  display: flex;
  column-gap: 2.4rem;
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

const StyledDevicePreviewButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  padding: 0.8rem;
  transition: var(--transition-base);
  background-color: ${({ $active }) => ($active ? 'var(--color-white-3)' : 'transparent')};

  &:hover {
    background-color: var(--color-white-3);
  }
`;
