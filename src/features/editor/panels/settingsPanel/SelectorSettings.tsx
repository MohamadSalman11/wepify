import { LuMonitor } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Title } from '.';
import Select from '../../../../components/form/Select';
import Icon from '../../../../components/Icon';
import { useAppSelector } from '../../../../store';
import { flattenElements } from '../../../../utils/flatten-elements';
import { selectElement } from '../../slices/selectionSlice';

/**
 * Styles
 */

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 1.2rem;
`;

/**
 * Component definition
 */

function SelectorSettings() {
  const dispatch = useDispatch();
  const page = useAppSelector((state) => state.page);
  const selection = useAppSelector((state) => state.selection.selectedElement);

  const handleSelection = (id: string) => {
    const selected = flattenElements(page.elements).find((el) => el.id === id);
    if (selected) dispatch(selectElement(selected));
  };

  return (
    <div>
      <Title>Selector</Title>
      <SelectorContainer>
        <Icon icon={LuMonitor} />
        <Select
          options={flattenElements(page.elements).map((el) => el.id)}
          defaultSelect={selection.id}
          onChange={(id) => handleSelection(id as string)}
        />
      </SelectorContainer>
    </div>
  );
}

export default SelectorSettings;
