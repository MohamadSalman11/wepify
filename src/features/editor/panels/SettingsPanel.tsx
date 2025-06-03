import { LuMonitor, LuPanelBottom, LuPanelLeft, LuPanelRight, LuPanelTop, LuSquare } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import Icon from '../../../components/Icon';
import ColorPicker from '../ColorPicker';
import { updateElement } from '../slices/pageSlice';
import { selectElement } from '../slices/selectionSlice';

const webSafeFonts = [
  'Arial',
  'Verdana',
  'Helvetica',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Segoe UI',
  'Impact',
  'System-ui',
  'Sans-serif',
  'Serif',
  'Monospace'
];

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 1.2rem;
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
  Input {
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

const Title = styled.span`
  margin-bottom: 2.4rem;
`;

function SettingsPanel() {
  const dispatch = useDispatch();
  const selection = useSelector((state) => state.selection.selectedElement);
  const page = useSelector((state) => state.page);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(updateElement({ id: selection.id, updates: { [name]: Number(value) } }));
  };

  const handleElementSelect = (selectedId) => {
    const selectedEl = page.elements.find((el) => el.id === selectedId);
    if (selectedEl) dispatch(selectElement(selectedEl));
  };

  return (
    <>
      <div>
        <Title>Selector</Title>
        <SelectorContainer>
          <Icon icon={LuMonitor} />
          <Select options={page.elements.map((el) => el.id)} onChange={handleElementSelect} />
        </SelectorContainer>
      </div>
      <SizeContainer>
        <Title>Size</Title>
        <GridContainer>
          <div>
            <label htmlFor='x-position'>X</label>
            <Input type='number' defaultValue={selection.x} id='x-position' name='x' onChange={handleChange} />
          </div>
          <div>
            <label htmlFor='y-position'>Y</label>
            <Input type='number' defaultValue={selection.y} id='y-position' name='y' onChange={handleChange} />
          </div>
          <div>
            <label htmlFor='width'>W</label>
            <Input type='number' defaultValue={selection.width} id='width' name='width' onChange={handleChange} />
          </div>
          <div>
            <label htmlFor='height'>H</label>
            <Input
              type='number'
              height={page.height}
              defaultValue={selection.height}
              id='height'
              name='height'
              onChange={handleChange}
            />
          </div>
        </GridContainer>
      </SizeContainer>
      <TypographyContainer>
        <Title>Typography</Title>
        <div>
          <div>
            <label>Font Family</label>
            <Select options={webSafeFonts} />
          </div>
          <GridContainer>
            <div>
              <label>Weight</label>
              <Select options={['100', '200', '300', '400', '500', '600', '700', '800', '900']} />
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
        <Title>Stroke</Title>
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
                <Icon icon={LuSquare} size='sm' />
              </div>
              <div>
                <span>Top</span>
                <Icon icon={LuPanelTop} size='sm' />
              </div>
              <div>
                <span>Right</span>
                <Icon icon={LuPanelRight} size='sm' />
              </div>
              <div>
                <span>Bottom</span>
                <Icon icon={LuPanelBottom} size='sm' />
              </div>
              <div>
                <span>Left</span>
                <Icon icon={LuPanelLeft} size='sm' />
              </div>
            </StrokePosition>
          </GridContainer>
        </div>
      </StrokeContainer>
    </>
  );
}

export default SettingsPanel;
