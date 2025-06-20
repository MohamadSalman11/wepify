import styled from 'styled-components';
import { GridContainer, Title, type HandleStyleChanges } from '.';
import Input from '../../../../components/form/Input';
import { useAppSelector } from '../../../../store';
import { formatNumber } from '../../../../utils/formatNumber';

/**
 * Styles
 */

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

/**
 * Component definition
 */

function SizeSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const selection = useAppSelector((state) => state.selection.present.selectedElement);

  return (
    <SizeContainer>
      <Title>Size</Title>
      <GridContainer>
        <div>
          <label>X</label>
          <Input
            disabled={selection.name === 'section' || selection.name === 'item'}
            type='number'
            name='x'
            defaultValue={selection.name === 'section' ? '' : formatNumber(selection.left)}
            onChange={(e) => handleStyleChanges(e.target.value, 'left')}
          />
        </div>
        <div>
          <label>Y</label>
          <Input
            disabled={selection.name === 'section' || selection.name === 'item'}
            type='number'
            name='y'
            defaultValue={selection.name === 'section' ? '' : formatNumber(selection.top)}
            onChange={(e) => handleStyleChanges(e.target.value, 'top')}
          />
        </div>
        <div>
          <label>W</label>
          <Input
            disabled={selection.name === 'section' || selection.name === 'item'}
            type='text'
            value={selection.name === 'section' ? '' : selection.width}
            onChange={(e) => handleStyleChanges(e.target.value, 'width')}
          />
        </div>
        <div>
          <label>H</label>
          <Input
            disabled={selection.name === 'item'}
            type='text'
            value={selection.height}
            onChange={(e) => handleStyleChanges(e.target.value, 'height')}
          />
        </div>
      </GridContainer>
    </SizeContainer>
  );
}

export default SizeSettings;
