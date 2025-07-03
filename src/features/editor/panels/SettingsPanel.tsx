import { FONT_WEIGHT_VALUES, OPTIONS_FONT } from '@shared/constants';
import type { GridElement, InputElement, LinkElement } from '@shared/types';
import { cloneElement, createContext, useContext, useState, type ChangeEvent, type ReactElement } from 'react';
import {
  LuAlignCenter,
  LuAlignEndHorizontal,
  LuAlignEndVertical,
  LuAlignHorizontalJustifyCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuAlignStartHorizontal,
  LuAlignStartVertical,
  LuAlignVerticalJustifyCenter,
  LuFlipHorizontal2,
  LuFlipVertical2,
  LuMonitor,
  LuPanelBottom,
  LuPanelLeft,
  LuPanelRight,
  LuPanelTop,
  LuRotateCwSquare
} from 'react-icons/lu';
import styled from 'styled-components';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import Icon from '../../../components/Icon';
import { useEditorContext } from '../../../pages/Editor';
import { useAppSelector } from '../../../store';
import { flattenElements } from '../../../utils/flattenElements';
import CollapsibleSection from '../CollapsibleSection';
import ColorPicker from '../ColorPicker';

/**
 * Constants
 */

const OPTIONS_COLUMN = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const OPTIONS_COLUMN_WIDTH = ['auto', 50, 100, 150, 200, 250, 300];
const OPTIONS_COLUMN_GAP = [2, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128];
const OPTIONS_ROW_GAP = OPTIONS_COLUMN_GAP;
const OPTIONS_ROW_HEIGHT = OPTIONS_COLUMN_WIDTH;
const OPTIONS_ROW = OPTIONS_COLUMN;
const OPTIONS_FONT_SIZE = ['Inherit', 10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128];
const OPTIONS_SIZE = ['screen', 'fill', 'fit', 50, 250, 500];

const DEFAULT_BORDER_COLOR = '#4a90e2';
const DEFAULT_BORDER_WIDTH = 2;

const BORDER_SIDES = [
  { side: 'top', label: 'Top', icon: LuPanelTop },
  { side: 'right', label: 'Right', icon: LuPanelRight },
  { side: 'bottom', label: 'Bottom', icon: LuPanelBottom },
  { side: 'left', label: 'Left', icon: LuPanelLeft }
] as const;

const OPTIONS_INPUT_TYPE = [
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'text',
  'time',
  'url',
  'week'
];

/**
 * Context
 */

const SettingsContext = createContext<SettingsContextType | null>(null);

const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('Settings panel components must be used within <SettingsPanel>');
  return context;
};

/**
 * Types
 */

type BorderSide = 'top' | 'right' | 'bottom' | 'left';

interface SettingsContextType {
  handleElementChange: (name: string, value: string | number) => void;
}

/**
 * Component definition
 */

export function SettingsPanel() {
  const selectedElement = useAppSelector((state) => state.selection.present.selectedElement);
  const { iframeConnection } = useEditorContext();

  const handleElementChange = (name: string, value: string | number) => {
    const updates = { [name]: value };

    if (selectedElement.name === 'grid') {
      Object.assign(updates, getSynchronizedGridUpdates(name, selectedElement as GridElement));
    }

    iframeConnection.updateElement(updates);
  };

  return (
    <SettingsContext.Provider value={{ handleElementChange }}>
      <SelectorSettings />
      <AlignmentSettings />
      {selectedElement.name !== 'grid' || <GridSettings />}
      {selectedElement.name === 'link' && <LinkSettings />}
      {selectedElement.name === 'input' && <InputSettings />}
      <SizeSettings />
      <SpacingSettings />
      <TypographySettings />
      {selectedElement.tag === 'section' || <StrokeSettings />}
    </SettingsContext.Provider>
  );
}

function ChangeElement({ children }: { children: ReactElement<{ onChange?: (event: ChangeEvent<any>) => void }> }) {
  const { handleElementChange } = useSettingsContext();

  return cloneElement(children, {
    onChange: (event: ChangeEvent<any>) => {
      handleElementChange(event.target.name, event.target.value);
    }
  });
}

function SelectorSettings() {
  const { elements } = useAppSelector((state) => state.page);
  const selection = useAppSelector((state) => state.selection.present.selectedElement);
  const { iframeConnection } = useEditorContext();

  const handleSelection = (id: string) => {
    iframeConnection.handleSelectionChange(id);
  };

  return (
    <div>
      <CollapsibleSection title='Selector' open={true}>
        <SelectorContainer>
          <Icon icon={LuMonitor} />
          <Select
            name='selector'
            options={flattenElements(elements).map((el) => el.id)}
            defaultSelect={selection.id}
            onChange={(event) => handleSelection(event.target.value as string)}
          />
        </SelectorContainer>
      </CollapsibleSection>
    </div>
  );
}

function SizeSettings() {
  const [rotate, setRotate] = useState(0);
  const { handleElementChange } = useSettingsContext();
  const selection = useAppSelector((state) => state.selection.present.selectedElement);

  const handleRotate = () => {
    const current = selection.rotate ?? 0;
    let newRotate = current - 90;
    if (newRotate <= -180) newRotate = 180;
    handleElementChange('rotate', newRotate);
    setRotate(newRotate);
  };

  const handleFlipHorizontal = () => {
    const currentScaleX = selection.scaleX ?? 1;
    const newScaleX = currentScaleX === 1 ? -1 : 1;
    handleElementChange('scaleX', newScaleX);
  };

  const handleFlipVertical = () => {
    const currentScaleY = selection.scaleY ?? 1;
    const newScaleY = currentScaleY === 1 ? -1 : 1;
    handleElementChange('scaleY', newScaleY);
  };

  return (
    <div>
      <CollapsibleSection title='Size'>
        <GridContainer>
          <SizeRow>
            <label>X</label>
            <ChangeElement>
              <Input name='left' disabled={selection.name === 'item'} type='number' defaultValue={selection.left} />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label>Y</label>
            <ChangeElement>
              <Input name='top' disabled={selection.name === 'item'} type='number' defaultValue={selection.top} />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label>W</label>
            <ChangeElement>
              <Select
                name='width'
                editable
                editInputType='text'
                options={OPTIONS_SIZE}
                defaultSelect={selection.width}
              />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label>H</label>
            <ChangeElement>
              <Select
                name='height'
                editable
                editInputType='text'
                options={OPTIONS_SIZE}
                defaultSelect={selection.height}
              />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label htmlFor='rotation'>R</label>
            <ChangeElement>
              <Input name='rotate' type='text' value={rotate} />
            </ChangeElement>
          </SizeRow>
          <RotationContainer>
            <Icon icon={LuRotateCwSquare} onClick={handleRotate} />
            <Icon icon={LuFlipHorizontal2} onClick={handleFlipHorizontal} />
            <Icon icon={LuFlipVertical2} onClick={handleFlipVertical} />
          </RotationContainer>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

export function AlignmentSettings() {
  const selection = useAppSelector((state) => state.selection.present.selectedElement);
  const { handleElementChange } = useSettingsContext();

  return (
    <div>
      <CollapsibleSection title='Alignment' open={true}>
        <AlignmentContainer>
          <AlignButton
            $active={selection.textAlign === 'left'}
            onClick={() => handleElementChange('justifyContent', 'flex-start')}
          >
            <Icon icon={LuAlignStartVertical} />
          </AlignButton>
          <AlignButton
            $active={selection.textAlign === 'right'}
            onClick={() => handleElementChange('justifyContent', 'flex-end')}
          >
            <Icon icon={LuAlignEndVertical} />
          </AlignButton>
          <AlignButton
            $active={selection.textAlign === 'right'}
            onClick={() => handleElementChange('alignItems', 'flex-start')}
          >
            <Icon icon={LuAlignStartHorizontal} />
          </AlignButton>
          <AlignButton
            $active={selection.textAlign === 'right'}
            onClick={() => handleElementChange('alignItems', 'flex-end')}
          >
            <Icon icon={LuAlignEndHorizontal} />
          </AlignButton>
          <AlignButton
            $active={selection.textAlign === 'right'}
            onClick={() => handleElementChange('justifyContent', 'center')}
          >
            <Icon icon={LuAlignHorizontalJustifyCenter} />
          </AlignButton>
          <AlignButton
            $active={selection.textAlign === 'right'}
            onClick={() => handleElementChange('alignItems', 'center')}
          >
            <Icon icon={LuAlignVerticalJustifyCenter} />
          </AlignButton>
        </AlignmentContainer>
      </CollapsibleSection>
    </div>
  );
}

export function SpacingSettings() {
  const { marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft } =
    useAppSelector((state) => state.selection.present.selectedElement);

  return (
    <div>
      <CollapsibleSection title='Spacing'>
        <SpacingBox>
          <div>
            <ChangeElement>
              <input name='marginTop' type='number' value={marginTop ?? 0} />
            </ChangeElement>
          </div>
          <PaddingBox>
            <div>
              <ChangeElement>
                <input name='paddingTop' type='number' value={paddingTop ?? 0} />
              </ChangeElement>
            </div>
            <div></div>
            <div>
              <ChangeElement>
                <input name='paddingTop' type='number' value={paddingLeft ?? 0} />
              </ChangeElement>
            </div>
            <div>
              <ChangeElement>
                <input name='paddingRight' type='number' value={paddingRight ?? 0} />
              </ChangeElement>
            </div>
            <div>
              <ChangeElement>
                <input name='paddingBottom' type='number' value={paddingBottom ?? 0} />
              </ChangeElement>
            </div>
          </PaddingBox>
          <div>
            <ChangeElement>
              <input name='marginLeft' type='number' value={marginLeft ?? 0} />
            </ChangeElement>
          </div>
          <div>
            <ChangeElement>
              <input name='marginRight' type='number' value={marginRight ?? 0} />
            </ChangeElement>
          </div>
          <div>
            <ChangeElement>
              <input name='marginBottom' type='number' value={marginBottom ?? 0} />
            </ChangeElement>
          </div>
        </SpacingBox>
      </CollapsibleSection>
    </div>
  );
}

function GridSettings() {
  const { columns, rows, columnWidth, rowHeight, columnGap, rowGap } = useAppSelector(
    (state) => state.selection.present.selectedElement
  ) as GridElement;

  return (
    <div>
      <CollapsibleSection title='Grid' open={true}>
        <GridContainer>
          <div>
            <SubTitle>Columns</SubTitle>
            <ChangeElement>
              <Select name='columns' editable defaultSelect={columns} options={OPTIONS_COLUMN} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Rows</SubTitle>
            <ChangeElement>
              <Select name='rows' editable defaultSelect={rows} options={OPTIONS_ROW} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Width</SubTitle>
            <ChangeElement>
              <Select
                name='columnWidth'
                editable
                editInputType='text'
                defaultSelect={columnWidth}
                options={OPTIONS_COLUMN_WIDTH}
              />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Height</SubTitle>
            <ChangeElement>
              <Select
                name='rowHeight'
                editable
                editInputType='text'
                defaultSelect={rowHeight}
                options={OPTIONS_ROW_HEIGHT}
              />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Gap X</SubTitle>
            <ChangeElement>
              <Select
                name='columnGap'
                editable
                editInputType='text'
                defaultSelect={columnGap}
                options={OPTIONS_COLUMN_GAP}
              />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Gap Y</SubTitle>
            <ChangeElement>
              <Select name='rowGap' editable editInputType='text' defaultSelect={rowGap} options={OPTIONS_ROW_GAP} />
            </ChangeElement>
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function LinkSettings() {
  const selection = useAppSelector((state) => state.selection.present.selectedElement) as LinkElement;

  return (
    <div>
      <CollapsibleSection title='Link' open={true}>
        <div>
          <ChangeElement>
            <Input name='link' type='text' defaultValue={selection.link} placeholder='https://example.com' />
          </ChangeElement>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function InputSettings() {
  const { type, placeholder } = useAppSelector((state) => state.selection.present.selectedElement) as InputElement;

  return (
    <div>
      <CollapsibleSection title='Input' open={true}>
        <GridContainer>
          <div>
            <SubTitle>Placeholder</SubTitle>
            <ChangeElement>
              <Input name='placeholder' type='text' defaultValue={placeholder} placeholder='E-Mail' />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Type</SubTitle>
            <ChangeElement>
              <Select name='type' editInputType='text' defaultSelect={type} options={OPTIONS_INPUT_TYPE} />
            </ChangeElement>
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function TypographySettings() {
  const selection = useAppSelector((state) => state.selection.present.selectedElement);
  const { handleElementChange } = useSettingsContext();

  return (
    <TypographyContainer>
      <CollapsibleSection title='Typography'>
        <div>
          <SubTitle>Font Family</SubTitle>
          <ChangeElement>
            <Select name='fontFamily' defaultSelect={selection.fontFamily} options={OPTIONS_FONT} />
          </ChangeElement>
        </div>
        <GridContainer>
          <div>
            <SubTitle>Weight</SubTitle>
            <ChangeElement>
              <Select
                name='fontWeight'
                defaultSelect={selection.fontWeight}
                options={Object.keys(FONT_WEIGHT_VALUES)}
              />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Font Size</SubTitle>
            <ChangeElement>
              <Select
                name='fontSize'
                editable
                editInputType='text'
                defaultSelect={selection.fontSize}
                options={OPTIONS_FONT_SIZE}
              />
            </ChangeElement>
          </div>
        </GridContainer>
        <GridContainer>
          <div>
            <SubTitle>Color</SubTitle>
            <ChangeElement>
              <ColorPicker name='color' defaultValue={selection.color} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Fill</SubTitle>
            <ChangeElement>
              <ColorPicker name='backgroundColor' defaultValue={selection.backgroundColor} />
            </ChangeElement>
          </div>
        </GridContainer>
        <div>
          <SubTitle>Text Align</SubTitle>
          <TextAlignContainer>
            <Icon icon={LuAlignLeft} onClick={() => handleElementChange('textAlign', 'left')} />
            <Icon icon={LuAlignRight} onClick={() => handleElementChange('textAlign', 'right')} />
            <Icon icon={LuAlignCenter} onClick={() => handleElementChange('textAlign', 'center')} />
            <Icon icon={LuAlignJustify} onClick={() => handleElementChange('textAlign', 'justify')} />
          </TextAlignContainer>
        </div>
      </CollapsibleSection>
    </TypographyContainer>
  );
}

function StrokeSettings() {
  const { handleElementChange } = useSettingsContext();
  const { borderTop, borderRight, borderBottom, borderLeft, borderColor, borderWidth } = useAppSelector(
    (state) => state.selection.present.selectedElement
  );

  const borders = { top: borderTop, right: borderRight, bottom: borderBottom, left: borderLeft };

  const toggleBorder = (side: BorderSide) => {
    const current = borders[side];

    const newValue = !current || current === 'none' ? `${borderWidth || DEFAULT_BORDER_WIDTH}px solid` : 'none';
  };

  return (
    <div>
      <CollapsibleSection title='Stroke'>
        <GridContainer>
          <div>
            <ChangeElement>
              <ColorPicker name='borderColor' defaultValue={borderColor || DEFAULT_BORDER_COLOR} />
            </ChangeElement>
          </div>
          <StrokeWidthContainer>
            <StrokeLabel>Stroke Width</StrokeLabel>
            <ChangeElement>
              <Input name='borderWidth' type='number' defaultValue={borderWidth || DEFAULT_BORDER_WIDTH} />
            </ChangeElement>
          </StrokeWidthContainer>
          <StrokePosition>
            {BORDER_SIDES.map(({ side, label, icon }) => (
              <BorderButton
                key={side}
                onClick={() => toggleBorder(side)}
                $active={!!borders[side] && borders[side] !== 'none'}
              >
                <span>{label}</span>
                <Icon icon={icon} size='sm' />
              </BorderButton>
            ))}
          </StrokePosition>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

const getSynchronizedGridUpdates = (propName: string, selection: GridElement) => {
  const updates = {} as any;

  if (propName === 'columnWidth') {
    updates.columns = selection.columns;
  }

  if (propName === 'columns') {
    updates.columnWidth = selection.columnWidth;
  }

  if (propName === 'rowHeight') {
    updates.rows = selection.rows;
  }

  if (propName === 'rows') {
    updates.rowHeight = selection.rowHeight;
  }

  return updates;
};

/**
 * Styles
 */

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const SubTitle = styled.label`
  display: inline-block;
  margin-bottom: 1.2rem;
  color: var(--color-gray-light-2);
  font-size: 1.2rem;
`;

const StrokeWidthContainer = styled.div`
  position: relative;

  Input {
    padding-right: 9.6rem;
    width: 100%;
  }
`;

const StrokeLabel = styled.label`
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  color: var(--color-gray);
  font-size: 1.2rem;
`;

const StrokePosition = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.9rem;
  justify-content: space-between;
  width: 0;
  margin-top: 1.2rem;
`;

const BorderButton = styled.div<{ $active?: boolean }>`
  display: flex;
  column-gap: 0.4rem;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ $active }) => ($active ? 'var(--color-black-light)' : 'var(--color-gray)')};
`;

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 1.2rem;
`;

const SizeRow = styled.div`
  display: flex;
  column-gap: 1.6rem;
  align-items: center;
  color: var(--color-gray);
`;

const TypographyContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3.2rem;
`;

const SpacingBox = styled.div`
  width: 100%;
  height: 17rem;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(5, 1fr);
  border-radius: var(--border-radius-lg);
  border: 1px dashed var(--color-gray-light-3);
  background-color: var(--color-white-3);
  position: relative;

  &::after {
    position: absolute;
    top: 5%;
    left: 4%;
    content: 'MARGIN';
    color: var(--color-gray-light-2);
    font-size: 1rem;
  }

  & > div:not(:nth-child(2)) {
    display: flex;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      grid-row: 1 / 2;
      grid-column: 1 / -1;
    }

    &:nth-child(3) {
      grid-row: 2 / 5;
      grid-column: 1 / 2;
    }

    &:nth-child(4) {
      grid-row: 2 / 5;
      grid-column: 8 / 9;
    }

    &:nth-child(5) {
      grid-row: 5 / 6;
      grid-column: 1 / -1;
    }
  }

  input {
    outline: none;
    background-color: transparent;
    width: 2rem;
    text-align: center;
  }
`;

const PaddingBox = styled.div`
  grid-row: 2 / 5;
  grid-column: 2 / 8;
  border: 2px solid var(--color-primary-light);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-gray-light-3);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
  position: relative;

  &::after {
    position: absolute;
    right: 4%;
    bottom: 9%;
    content: 'PADDING';
    color: var(--color-gray-light-2);
    font-size: 1rem;
  }

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      grid-row: 1 / 3;
      grid-column: 1 / -1;
    }

    &:nth-child(2) {
      grid-row: 3 / 5;
      grid-column: 2 / 5;
      border-radius: var(--border-radius-full);
      background-color: var(--color-gray-light-2);
    }

    &:nth-child(3) {
      grid-row: 3 / 5;
      grid-column: 1 / 2;
    }

    &:nth-child(4) {
      grid-row: 3 / 5;
      grid-column: 5 / 9;
    }

    &:nth-child(5) {
      grid-row: 5 / 7;
      grid-column: 1 / -1;
    }
  }
`;

const AlignmentContainer = styled.div`
  display: flex;
  flex-direction: row !important;
  justify-content: space-around;
  align-items: center;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white-3);
  padding: 0.6rem;
`;

const AlignButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-gray)')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 0.4rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-white-dark);
  }
`;

const TextAlignContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white-3);
  padding: 1.2rem;

  svg {
    cursor: pointer;
  }
`;

const RotationContainer = styled.div`
  margin-left: auto;
  column-gap: 2.4rem !important;

  svg {
    cursor: pointer;
  }
`;
