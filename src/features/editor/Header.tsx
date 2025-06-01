import { LuDownload, LuEye, LuLaptop, LuMonitor, LuRedo2, LuSmartphone, LuTablet, LuUndo2 } from 'react-icons/lu';
import styled from 'styled-components';
import Divider from '../../components/divider';

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

  svg {
    font-size: 2.4rem;
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

    input {
      border-radius: var(--border-radius-md);
      background-color: var(--color-gray-dark-2);
      padding: 0.8rem 0.8rem 0.8rem 2.4rem;
      width: 7rem;
      color: var(--color-white);
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

  & > svg {
    font-size: 2rem;
  }

  button {
    transition: var(--transition-base);
    border-radius: 8px;
    background-color: var(--color-primary);
    width: 12rem;
    height: 4.5rem;
    color: var(--color-white);
    font-size: 1.4rem;

    &:hover {
      background-color: var(--color-primary-light);
    }
  }

  & button:first-of-type {
    background-color: transparent;
    background-color: var(--color-gray-dark-2);

    &:hover {
      background-color: var(--color-gray-dark);
    }
  }
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
        <LuMonitor />
        <LuLaptop />
        <LuTablet />
        <LuSmartphone />
        <CanvasSizeControls>
          <div>
            <span>W</span>
            <input type='text' defaultValue={1440} placeholder='px' />
          </div>
          <div>
            <span>H</span>
            <input type='text' defaultValue={880} placeholder='px' />
          </div>
        </CanvasSizeControls>
      </DevicePreviewControls>
      <EditorActions>
        <LuUndo2 />
        <LuRedo2 />
        <Divider rotate={90} width={30} />
        <LuEye />
        <Divider rotate={90} width={30} />
        <button>
          <LuDownload /> Download
        </button>
        <button>Publish</button>
      </EditorActions>
    </StyledHeader>
  );
}

export default Header;
