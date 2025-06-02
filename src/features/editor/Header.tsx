import { LuEye, LuLaptop, LuMonitor, LuRedo2, LuSmartphone, LuTablet, LuUndo2 } from 'react-icons/lu';
import styled from 'styled-components';
import Button from '../../components/Button';
import Divider from '../../components/divider';
import Input from '../../components/form/Input';
import Icon from '../../components/Icon';

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
  return (
    <StyledHeader>
      <DesignInfo>
        <span>Pulse</span>
        <p>Landing page site</p>
      </DesignInfo>
      <DevicePreviewControls>
        <Icon icon={LuMonitor} />
        <Icon icon={LuLaptop} />
        <Icon icon={LuTablet} />
        <Icon icon={LuSmartphone} />
        <CanvasSizeControls>
          <div>
            <span>W</span>
            <CanvasSizeInput type='text' defaultValue={1440} placeholder='px' />
          </div>
          <div>
            <span>H</span>
            <CanvasSizeInput type='text' defaultValue={880} placeholder='px' />
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
