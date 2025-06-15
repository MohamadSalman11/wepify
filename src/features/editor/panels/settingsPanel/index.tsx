/**
 * Styles
 */

import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../../store';
import type { GridElement } from '../../../../types';
import { getSynchronizedGridUpdates } from '../../helpers/getSynchronizedGridUpdates';
import { updateElement } from '../../slices/pageSlice';
import { setSelectLastUpdates, updateSelectElement } from '../../slices/selectionSlice';
import GridSettings from './GridSettings';
import InputSettings from './InputSettings';
import LinkSettings from './LinkSettings';
import SelectorSettings from './SelectorSettings';
import SizeSettings from './SizeSettings';
import StrokeSettings from './StrokeSettings';
import TypographySettings from './TypographySettings';

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

export const Title = styled.span`
  margin-bottom: 2.4rem;
`;

export const SubTitle = styled.label`
  display: inline-block;
  margin-bottom: 1.2rem;
  color: var(--color-gray-light-2);
  font-size: 1.2rem;
`;

/**
 * Types
 */

export type HandleStyleChanges = (value: string | number, name: string) => void;

/**
 * Component definition
 */

function SettingsPanel() {
  const dispatch = useDispatch();
  const selection = useAppSelector((state) => state.selection.selectedElement);

  const handleStyleChanges = (value: string | number, name: string) => {
    const updates = { [name]: value };

    if (selection.name === 'grid') {
      Object.assign(updates, getSynchronizedGridUpdates(name, selection as GridElement));
    }

    dispatch(updateElement({ id: selection.id, updates }));
    dispatch(updateSelectElement(updates));
    dispatch(setSelectLastUpdates(updates));
  };

  return (
    <>
      <SelectorSettings />
      <SizeSettings handleStyleChanges={handleStyleChanges} />
      {selection.name !== 'grid' || <GridSettings handleStyleChanges={handleStyleChanges} />}
      {selection.name === 'link' && <LinkSettings handleStyleChanges={handleStyleChanges} />}
      {selection.name === 'input' && <InputSettings handleStyleChanges={handleStyleChanges} />}
      <TypographySettings handleStyleChanges={handleStyleChanges} />
      {selection.tag === 'section' || <StrokeSettings handleStyleChanges={handleStyleChanges} />}
    </>
  );
}

export default SettingsPanel;
