import { useState } from 'react';
import type { IconType } from 'react-icons';
import { LuEye, LuLaptop, LuMonitor, LuRedo2, LuSmartphone, LuTablet, LuUndo2 } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ActionCreators } from 'redux-undo';
import styled from 'styled-components';
import Button from '../../components/Button';
import Divider from '../../components/divider';
import Input from '../../components/form/Input';
import Icon from '../../components/Icon';
import { EditorPath } from '../../constant';
import { useAppSelector } from '../../store';
import type { InputChangeEvent } from '../../types';
import { setIsLoading } from './slices/editorSlice';
import { setHeight, setScale, setWidth } from './slices/pageSlice';

/**
 * Constants
 */

const SCREEN_SIZES = {
  monitor: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  smartphone: { width: 375, height: 667 }
} as const;

/**
 * Styles
 */

const CanvasSizeInput = styled(Input)`
  width: 7rem;
  padding: 0.8rem 0.8rem 0.8rem 2.4rem;
`;

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

const CanvasSizeControls = styled.div`
  display: flex;
  column-gap: 1.2rem;
  align-items: center;

  div {
    position: relative;

    span {
      position: absolute;
      top: 55%;
      left: 10%;
      transform: translateY(-50%);
      color: var(--color-gray);
      font-size: 1.2rem;
    }
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

const StyledDevicePreviewButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  padding: 0.8rem;
  transition: var(--transition-base);
  background-color: ${({ active }) => (active ? 'var(--color-white-3)' : 'transparent')};

  &:hover {
    background-color: var(--color-white-3);
  }
`;

/**
 * Types
 */

type Size = { width: number; height: number };
type DeviceType = keyof typeof SCREEN_SIZES | 'auto';

/**
 * Component definition
 */

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeDevice, setActiveDevice] = useState<DeviceType>('auto');
  const { siteName, siteDescription, width, height, scale } = useAppSelector((state) => state.page);

  const handleHeightChange = (event: InputChangeEvent) => {
    const newHeight = Number(event.target.value);
    dispatch(setHeight(newHeight));
  };

  const handleWidthChange = (event: InputChangeEvent) => {
    const newWidth = Number(event.target.value);
    dispatch(setWidth(newWidth));
  };

  const handleScaleChange = (event: InputChangeEvent) => {
    const newScale = Number(event.target.value);
    dispatch(setScale(newScale));
  };

  return (
    <StyledHeader>
      <DesignInfo>
        <span>{siteName}</span>
        <p>{siteDescription}</p>
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
        <CanvasSizeControls>
          <div>
            <span>W</span>
            <CanvasSizeInput type='text' value={width} placeholder='px' onChange={handleWidthChange} />
          </div>
          <div>
            <span>H</span>
            <CanvasSizeInput type='text' value={height} placeholder='px' onChange={handleHeightChange} />
          </div>
          <div>
            <span>%</span>
            <CanvasSizeInput type='text' value={scale} placeholder='%' onChange={handleScaleChange} />
          </div>
        </CanvasSizeControls>
      </DevicePreviewControls>
      <EditorActions>
        <Icon
          onClick={() => {
            dispatch(ActionCreators.undo());
          }}
          icon={LuUndo2}
        />
        <Icon
          onClick={() => {
            dispatch(ActionCreators.redo());
          }}
          icon={LuRedo2}
        />
        <Divider rotate={90} width={30} />
        <Icon
          onClick={() => {
            navigate(EditorPath.Preview, { replace: true });
            dispatch(setIsLoading(true));
          }}
          icon={LuEye}
          hover={true}
        />
        <Divider rotate={90} width={30} />
        <Button variation='secondary'>Download</Button>
        <Button>Publish</Button>
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

  const setCanvasSize = (size: Size, newScale?: number) => {
    dispatch(setWidth(size.width));
    dispatch(setHeight(size.height));
    dispatch(setScale(newScale ?? 100));
  };

  function calculateScaleToFit(containerSize: Size, targetSize: Size) {
    const scaleX = containerSize.width / targetSize.width;
    const scaleY = containerSize.height / targetSize.height;
    const scaleVal = Math.floor(Math.min(scaleX, scaleY) * 100);
    return Math.max(Math.min(scaleVal, 100), 10);
  }

  const handleClick = () => {
    if (isActive) {
      setActiveDevice('auto');
      setCanvasSize({ width: originWidth, height: originHeight }, 100);
    } else {
      const scaleVal = calculateScaleToFit({ width: originWidth, height: originHeight }, screenSize);
      setCanvasSize(screenSize, scaleVal);
      setActiveDevice(deviceType);
    }
  };

  return (
    <StyledDevicePreviewButton active={isActive} onClick={handleClick}>
      <Icon icon={icon} />
    </StyledDevicePreviewButton>
  );
}

export default Header;
