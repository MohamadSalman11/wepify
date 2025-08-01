import { PAGE_PADDING_X, SCREEN_SIZES } from '@shared/constants';
import type { Site } from '@shared/typing';
import type { IconType } from 'react-icons';
import { LuEye, LuFileCode2, LuFileMinus, LuLaptop, LuMonitor, LuSmartphone, LuTablet } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Divider from '../../components/divider';
import Dropdown from '../../components/Dropdown';
import Input from '../../components/form/Input';
import Icon from '../../components/Icon';
import { EditorPath, StorageKey } from '../../constant';
import { useIframeContext } from '../../context/IframeContext';
import { useAppSelector } from '../../store';
import { AppStorage } from '../../utils/appStorage';
import { calculateScaleToFit } from '../../utils/calculateScaleToFit';
import { setDeviceType, setIsDownloadingSite, setIsLoading } from './slices/editorSlice';
import { setScale, setSize } from './slices/pageSlice';

/**
 * Constants
 */

const PUBLISH_LINK = 'https://app.netlify.com/drop';

const DEVICES = [
  {
    icon: LuMonitor,
    type: 'monitor'
  },
  {
    icon: LuLaptop,
    type: 'laptop'
  },
  {
    icon: LuTablet,
    type: 'tablet'
  },
  {
    icon: LuSmartphone,
    type: 'smartphone'
  }
] as const;

/**
 * Types
 */

type Size = { width: number; height: number };
type DeviceType = keyof typeof SCREEN_SIZES;

/**
 * Component definition
 */

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { iframeConnection } = useIframeContext();
  const { site, isDownloadingSite, deviceType } = useAppSelector((state) => state.editor);
  const { originWidth, originHeight } = useAppSelector((state) => state.page);

  const handleDownloadSite = async (shouldMinify: boolean) => {
    dispatch(setIsDownloadingSite(true));
    const site = await AppStorage.getItem<Site>(StorageKey.Site);
    iframeConnection.downloadSite(site, shouldMinify);
  };

  const handleSitePreview = () => {
    dispatch(
      setScale(
        calculateScaleToFit(
          { width: originWidth, height: originHeight },
          { width: SCREEN_SIZES.tablet.width + PAGE_PADDING_X, height: SCREEN_SIZES.tablet.height }
        )
      )
    );
    dispatch(setIsLoading(true));
    navigate(EditorPath.Preview);
  };

  return (
    <StyledHeader>
      <DesignInfo>
        <span>{site.name}</span>
        <p>{site.description}</p>
      </DesignInfo>
      <DevicePreviewControls>
        {DEVICES.map(({ icon, type }) => (
          <DevicePreviewButton
            key={type}
            icon={icon}
            deviceType={type}
            isActive={deviceType === type}
            setActiveDevice={() => dispatch(setDeviceType(type))}
            screenSize={SCREEN_SIZES[type]}
          />
        ))}
        <SizeInputs>
          <div>
            <label htmlFor='preview-input-width'>W</label>
            <Input id='preview-input-width' placeholder={`${SCREEN_SIZES[deviceType].width}px`} disabled />
          </div>
          <div>
            <label htmlFor='preview-input-height'>H</label>
            <Input id='preview-input-height' placeholder={`${SCREEN_SIZES[deviceType].height}px`} disabled />
          </div>
        </SizeInputs>
      </DevicePreviewControls>

      <EditorActions>
        <Icon icon={LuEye} hover={true} tooltipLabel='Preview Site' onClick={handleSitePreview} />
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

  const setCanvasSize = (size: Size, scaleFactor: number = 100) => {
    dispatch(setSize({ width: size.width, height: size.height }));
    dispatch(setScale(scaleFactor));
  };

  const handleClick = () => {
    const scaleVal = calculateScaleToFit({ width: originWidth, height: originHeight }, screenSize);
    setCanvasSize(screenSize, scaleVal);
    dispatch(setDeviceType(deviceType));
    setActiveDevice(deviceType);
  };

  return (
    <Icon
      hover
      isActive={isActive}
      borderRadius='md'
      icon={icon}
      tooltipLabel={getTooltipLabel(deviceType)}
      tooltipSideOffset={10}
      onClick={handleClick}
    />
  );
}

const getTooltipLabel = (deviceType: DeviceType) => {
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
};

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
    justify-content: end;

    &:not(:nth-child(2)) {
      width: 50rem;
    }

    &:nth-child(2) {
      justify-content: center;
      min-width: 54rem;
      max-width: 54rem;
    }
  }
`;

const DevicePreviewControls = styled.div`
  display: flex;
  column-gap: 4.4rem;
  align-items: center;
`;

const SizeInputs = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.6rem;

  & > div {
    display: flex;
    column-gap: 0.8rem;
    align-items: center;
  }

  input {
    cursor: default !important;
    padding-right: 1.2rem;
    padding-left: 1.2rem;
    text-align: center;
  }

  label {
    color: var(--color-gray-light);
  }
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
