import { GridContainer, SubTitle, Title, type HandleStyleChanges } from '.';
import Select from '../../../../components/form/Select';
import { useAppSelector } from '../../../../store';
import type { GridElement } from '../../../../types';

/**
 * Constants
 */

const OPTIONS_COLUMN = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const OPTIONS_COLUMN_WIDTH = ['auto', 50, 100, 150, 200, 250, 300];
const OPTIONS_COLUMN_GAP = [2, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128];
const OPTIONS_ROW_GAP = OPTIONS_COLUMN_GAP;
const OPTIONS_ROW_HEIGHT = OPTIONS_COLUMN_WIDTH;
const OPTIONS_ROW = OPTIONS_COLUMN;

/**
 * Component definition
 */

function GridSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const { columns, rows, columnWidth, rowHeight, columnGap, rowGap } = useAppSelector(
    (state) => state.selection.selectedElement
  ) as GridElement;

  return (
    <div>
      <Title>Grid</Title>
      <GridContainer>
        <div>
          <SubTitle>Columns</SubTitle>
          <Select
            editable
            defaultSelect={columns}
            options={OPTIONS_COLUMN}
            onChange={(option) => handleStyleChanges(option, 'columns')}
          />
        </div>
        <div>
          <SubTitle>Rows</SubTitle>
          <Select
            editable
            defaultSelect={rows}
            options={OPTIONS_ROW}
            onChange={(option) => handleStyleChanges(option, 'rows')}
          />
        </div>
        <div>
          <SubTitle>Width</SubTitle>
          <Select
            editable
            editInputType='text'
            defaultSelect={columnWidth}
            options={OPTIONS_COLUMN_WIDTH}
            onChange={(option) => handleStyleChanges(option, 'columnWidth')}
          />
        </div>
        <div>
          <SubTitle>Height</SubTitle>
          <Select
            editable
            editInputType='text'
            defaultSelect={rowHeight}
            options={OPTIONS_ROW_HEIGHT}
            onChange={(option) => handleStyleChanges(option, 'rowHeight')}
          />
        </div>
        <div>
          <SubTitle>Gap X</SubTitle>
          <Select
            editable
            editInputType='text'
            defaultSelect={columnGap}
            options={OPTIONS_COLUMN_GAP}
            onChange={(option) => handleStyleChanges(option, 'columnGap')}
          />
        </div>
        <div>
          <SubTitle>Gap Y</SubTitle>
          <Select
            editable
            editInputType='text'
            defaultSelect={rowGap}
            options={OPTIONS_ROW_GAP}
            onChange={(option) => handleStyleChanges(option, 'rowGap')}
          />
        </div>
      </GridContainer>
    </div>
  );
}

export default GridSettings;
