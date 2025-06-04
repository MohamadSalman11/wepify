import { LuEye, LuLaptop, LuMonitor, LuRedo2, LuSmartphone, LuTablet, LuUndo2 } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import Divider from '../../components/divider';
import Input from '../../components/form/Input';
import Icon from '../../components/Icon';
import { setHeight, setScale, setWidth } from './slices/pageSlice';

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
  background-color: var(--color-black-light-2);

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

function Header() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page);

  const handleHeightChange = (e) => {
    const newHeight = Number(e.target.value);
    dispatch(setHeight(newHeight));
  };

  const handleWidthChange = (e) => {
    const newWidth = Number(e.target.value);
    dispatch(setWidth(newWidth));
  };

  const handleScaleChange = (e) => {
    const newScale = Number(e.target.value);
    dispatch(setScale(newScale));
  };

  const setCanvasSize = (width, height, scale?) => {
    dispatch(setWidth(width));
    dispatch(setHeight(height));
    dispatch(setScale(scale || 100));
  };

  function calculateScaleToFit(containerWidth, containerHeight, targetWidth, targetHeight) {
    const scaleX = containerWidth / targetWidth;
    const scaleY = containerHeight / targetHeight;
    const scale = Math.floor(Math.min(scaleX, scaleY) * 100);
    return Math.max(Math.min(scale, 100), 10);
  }

  return (
    <StyledHeader>
      <DesignInfo>
        <span>Pulse</span>
        <p>Landing page site</p>
      </DesignInfo>
      <DevicePreviewControls>
        <Icon
          icon={LuMonitor}
          onClick={() => {
            const scale = calculateScaleToFit(page.originWidth, page.originHeight, 1440, 900);
            setCanvasSize(1440, 900, scale);
          }}
        />
        <Icon
          icon={LuLaptop}
          onClick={() => {
            const scale = calculateScaleToFit(page.originWidth, page.originHeight, 1280, 800);
            console.log(scale);
            setCanvasSize(1280, 800, scale);
          }}
        />
        <Icon
          icon={LuTablet}
          onClick={() => {
            const scale = calculateScaleToFit(page.originWidth, page.originHeight, 768, 1024);
            console.log(scale);
            setCanvasSize(768, 1024, scale);
          }}
        />
        <Icon
          icon={LuSmartphone}
          onClick={() => {
            const scale = calculateScaleToFit(page.originWidth, page.originHeight, 375, 667);
            console.log(scale);
            setCanvasSize(375, 667, scale);
          }}
        />

        <CanvasSizeControls>
          <div>
            <span>W</span>
            <CanvasSizeInput type='text' value={page.width} placeholder='px' onChange={handleWidthChange} />
          </div>
          <div>
            <span>H</span>
            <CanvasSizeInput type='text' value={page.height} placeholder='px' onChange={handleHeightChange} />
          </div>
          <div>
            <span>%</span>
            <CanvasSizeInput type='text' value={page.scale} placeholder='%' onChange={handleScaleChange} />
          </div>
        </CanvasSizeControls>
      </DevicePreviewControls>

      <EditorActions>
        <Icon icon={LuUndo2} />
        <Icon icon={LuRedo2} />
        <Divider rotate={90} width={30} />
        <Icon icon={LuEye} />
        <Divider rotate={90} width={30} />
        <Button variation='secondary'>Download</Button>
        <Button>Publish</Button>
      </EditorActions>
    </StyledHeader>
  );
}

export default Header;
