import { LuMonitor, LuPanelBottom, LuPanelLeft, LuPanelRight, LuPanelTop, LuSquare } from 'react-icons/lu';
import styled from 'styled-components';
import Select from '../../components/Select';
import ColorPicker from './ColorPicker';

const PanelContainer = styled.div`
  border-left: 1px solid var(--color-gray-dark-2);
  background-color: var(--color-black-light-2);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    display: flex;
    flex-direction: column;
    border-bottom: var(--border-base);
    padding: 3.2rem 2.4rem;
    width: 100%;

    & > span {
      margin-bottom: 2.4rem;
    }
  }
`;

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 1.2rem;

  svg {
    color: var(--color-white);
    font-size: 2.4rem;
  }
`;

const SizeContainer = styled.div`
  & > div {
    div {
      display: flex;
      column-gap: 1.6rem;
      align-items: center;
      color: var(--color-gray);
    }
  }
`;

const Input = styled.input`
  border-radius: var(--border-radius-md);
  background-color: var(--color-gray-dark-2);
  padding: 0.8rem 0.8rem 0.8rem 1.2rem;
  width: 9rem;
  color: var(--color-white);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const StrokeContainer = styled.div`
  label {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    color: var(--color-gray);
    font-size: 1.2rem;
  }
`;

const StrokeWidthContainer = styled.div`
  position: relative;
  input {
    padding-right: 9.6rem;
    width: 100%;
  }
`;

const StrokePosition = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.9rem;
  justify-content: space-between;
  width: 0;
  margin-top: 1.2rem;

  & div {
    display: flex;
    column-gap: 0.4rem;
    align-items: center;
    cursor: pointer;
    color: var(--color-gray);
    font-size: 1.2rem;

    &:hover {
      color: var(--color-gray-dark);
    }
  }
`;

const TypographyContainer = styled.div`
  & > div {
    display: flex;
    row-gap: 2.4rem;
    flex-direction: column;
  }

  label {
    display: inline-block;
    margin-bottom: 1.2rem;
    font-size: 1.2rem;
  }
`;

function SettingsPanel() {
  return (
    <PanelContainer>
      <div>
        <span>Selector</span>
        <SelectorContainer>
          <LuMonitor />
          <Select options={['Chocolate', 'Vanilla', 'Strawberry']} />
        </SelectorContainer>
      </div>
      <SizeContainer>
        <span>Size</span>
        <GridContainer>
          <div>
            <label htmlFor='y-position'>X</label>
            <Input type='text' defaultValue={200} id='y-position' />
          </div>
          <div>
            <label htmlFor='x-position'>Y</label>
            <Input type='text' defaultValue={100} id='x-position' />
          </div>
          <div>
            <label htmlFor='width'>W</label>
            <Input type='text' defaultValue={100} id='width' />
          </div>
          <div>
            <label htmlFor='height'>H</label>
            <Input type='text' defaultValue={100} id='height' />
          </div>
        </GridContainer>
      </SizeContainer>
      <TypographyContainer>
        <span>Typography</span>
        <div>
          <div>
            <label>Font Family</label>
            <Select options={['Arial', 'Sans-Serif', 'Roboto']} />
          </div>
          <GridContainer>
            <div>
              <label>Weight</label>
              <Select options={['500', '600', '700']} />
            </div>
            <div>
              <label>Font Size</label>
              <Select options={['10', '12', '13']} />
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <label>Color</label>
              <ColorPicker />
            </div>
            <div>
              <label>Fill</label>
              <ColorPicker />
            </div>
          </GridContainer>
        </div>
      </TypographyContainer>
      <StrokeContainer>
        <span>Stroke</span>
        <div>
          <GridContainer>
            <div>
              <ColorPicker />
            </div>
            <StrokeWidthContainer>
              <label htmlFor='stroke-width'>Stroke Width</label>
              <Input type='text' defaultValue={1} id='stroke-width' />
            </StrokeWidthContainer>
            <StrokePosition>
              <div>
                <span>All</span>
                <LuSquare />
              </div>
              <div>
                <span>Top</span>
                <LuPanelTop />
              </div>
              <div>
                <span>Right</span>
                <LuPanelRight />
              </div>
              <div>
                <span>Bottom</span>
                <LuPanelBottom />
              </div>
              <div>
                <span>Left</span>
                <LuPanelLeft />
              </div>
            </StrokePosition>
          </GridContainer>
        </div>
      </StrokeContainer>
    </PanelContainer>
  );
}

export default SettingsPanel;
