import { FONT_WEIGHT_VALUES, OPTIONS_FONT } from '@shared/constants';
import type { GridElement, InputElement, LinkElement } from '@shared/types';
import { useState } from 'react';
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
import ColorPicker from '../ColorPicker';
import CollapsibleSection from './CollapsibleSection';

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
 * Styles
 */

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

export const SubTitle = styled.label`
  display: inline-block;
  margin-bottom: 1.2rem;
  color: var(--color-gray-light-2);
  font-size: 1.2rem;
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
`;

const BorderButton = styled.div<{ active?: boolean }>`
  display: flex;
  column-gap: 0.4rem;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ active }) => (active ? 'var(--color-black-light)' : 'var(--color-gray)')};
`;

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

const TypographyContainer = styled.div`
  & > div:not(:first-child) {
    display: flex;
    row-gap: 3.2rem;
    flex-direction: column;
  }
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

const AlignButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active }) => (active ? 'var(--color-primary)' : 'var(--color-gray)')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 0.4rem;
  transition: background 0.2s;

  &:hover {
    background: var(--color-white-dark);
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

/**
 * Types
 */

export type HandleStyleChanges = (value: string | number, name: string) => void;
type BorderSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Component definition
 */

export function SettingsPanel() {
  const selection = useAppSelector((state) => state.selection.present.selectedElement);
  const { iframeConnection } = useEditorContext();

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

  const handleStyleChanges = (value: string | number, name: string) => {
    const updates = { [name]: value };

    if (selection.name === 'grid') {
      Object.assign(updates, getSynchronizedGridUpdates(name, selection as GridElement));
    }

    iframeConnection.updateElement(updates);
  };

  return (
    <>
      <SelectorSettings />
      <AlignmentSettings handleStyleChanges={handleStyleChanges} />
      {selection.name !== 'grid' || <GridSettings handleStyleChanges={handleStyleChanges} />}
      {selection.name === 'link' && <LinkSettings handleStyleChanges={handleStyleChanges} />}
      {selection.name === 'input' && <InputSettings handleStyleChanges={handleStyleChanges} />}
      <SizeSettings handleStyleChanges={handleStyleChanges} />
      <SpacingSettings handleStyleChanges={handleStyleChanges} />
      <TypographySettings handleStyleChanges={handleStyleChanges} />
      {selection.tag === 'section' || <StrokeSettings handleStyleChanges={handleStyleChanges} />}
    </>
  );
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
            options={flattenElements(elements).map((el) => el.id)}
            defaultSelect={selection.id}
            onChange={(id) => handleSelection(id as string)}
          />
        </SelectorContainer>
      </CollapsibleSection>
    </div>
  );
}

function SizeSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const selection = useAppSelector((state) => state.selection.present.selectedElement);
  const [tempRotation, setTempRotation] = useState((selection.rotate ?? 0) + '°');

  return (
    <SizeContainer>
      <CollapsibleSection title='Size'>
        <GridContainer>
          <div>
            <label>X</label>
            <Input
              disabled={selection.name === 'item'}
              type='number'
              name='x'
              defaultValue={selection.top}
              onChange={(e) => handleStyleChanges(e.target.value, 'left')}
            />
          </div>
          <div>
            <label>Y</label>
            <Input
              disabled={selection.name === 'item'}
              type='number'
              name='y'
              defaultValue={selection.top}
              onChange={(e) => handleStyleChanges(e.target.value, 'top')}
            />
          </div>
          <div>
            <label>W</label>
            <Select
              editable
              editInputType='text'
              defaultSelect={selection.width}
              options={OPTIONS_SIZE}
              onChange={(option) => handleStyleChanges(option, 'width')}
            />
          </div>
          <div>
            <label>H</label>
            <Select
              editable
              editInputType='text'
              defaultSelect={selection.height}
              options={OPTIONS_SIZE}
              onChange={(option) => handleStyleChanges(option, 'height')}
            />
          </div>
          <div>
            <label htmlFor='rotation'>R</label>
            <Input
              type='text'
              value={tempRotation}
              onChange={(e) => {
                setTempRotation(e.target.value);
                handleStyleChanges(e.target.value, 'rotate');
              }}
              onBlur={() => {
                const val = parseFloat(tempRotation.replace(/[^0-9.-]/g, '')) || 0;
                handleStyleChanges(val, 'rotate');
                setTempRotation(val + '°');
              }}
              onFocus={() => {
                setTempRotation((selection.rotate ?? 0).toString());
              }}
            />
          </div>
          <RotationContainer>
            <Icon
              icon={LuRotateCwSquare}
              onClick={() => {
                const current = selection.rotate ?? 0;
                let newRotate = current - 90;

                if (newRotate <= -180) {
                  newRotate = 180;
                }

                handleStyleChanges(newRotate, 'rotate');
                setTempRotation(newRotate + '°');
              }}
            />
            <Icon
              icon={LuFlipHorizontal2}
              onClick={() => {
                const currentScaleX = selection.scaleX ?? 1;
                const newScaleX = currentScaleX === 1 ? -1 : 1;
                handleStyleChanges(newScaleX, 'scaleX');
                setTempRotation('0°');
              }}
            />
            <Icon
              icon={LuFlipVertical2}
              onClick={() => {
                const currentScaleY = selection.scaleY ?? 1;
                const newScaleY = currentScaleY === 1 ? -1 : 1;
                handleStyleChanges(newScaleY, 'scaleY');
                setTempRotation('0°');
              }}
            />
          </RotationContainer>
        </GridContainer>
      </CollapsibleSection>
    </SizeContainer>
  );
}

export function AlignmentSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const selection = useAppSelector((state) => state.selection.present.selectedElement);

  return (
    <div>
      <CollapsibleSection title='Alignment' open={true}>
        <AlignmentContainer>
          <AlignButton
            active={selection.textAlign === 'left'}
            onClick={() => handleStyleChanges('flex-start', 'justifyContent')}
          >
            <Icon icon={LuAlignStartVertical} />
          </AlignButton>
          <AlignButton
            active={selection.textAlign === 'right'}
            onClick={() => handleStyleChanges('flex-end', 'justifyContent')}
          >
            <Icon icon={LuAlignEndVertical} />
          </AlignButton>
          <AlignButton
            active={selection.textAlign === 'right'}
            onClick={() => handleStyleChanges('flex-start', 'alignItems')}
          >
            <Icon icon={LuAlignStartHorizontal} />
          </AlignButton>
          <AlignButton
            active={selection.textAlign === 'right'}
            onClick={() => handleStyleChanges('flex-end', 'alignItems')}
          >
            <Icon icon={LuAlignEndHorizontal} />
          </AlignButton>
          <AlignButton
            active={selection.textAlign === 'right'}
            onClick={() => handleStyleChanges('center', 'justifyContent')}
          >
            <Icon icon={LuAlignHorizontalJustifyCenter} />
          </AlignButton>
          <AlignButton
            active={selection.textAlign === 'right'}
            onClick={() => handleStyleChanges('center', 'alignItems')}
          >
            <Icon icon={LuAlignVerticalJustifyCenter} />
          </AlignButton>
        </AlignmentContainer>
      </CollapsibleSection>
    </div>
  );
}

export function SpacingSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const { marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft } =
    useAppSelector((state) => state.selection.present.selectedElement);

  return (
    <div>
      <CollapsibleSection title='Spacing'>
        <SpacingBox>
          <div>
            <input
              type='number'
              value={marginTop ?? 0}
              onChange={(event) => handleStyleChanges(event.target.value, 'marginTop')}
            />
          </div>
          <PaddingBox>
            <div>
              <input
                type='number'
                value={paddingTop ?? 0}
                onChange={(event) => handleStyleChanges(event.target.value, 'paddingTop')}
              />
            </div>
            <div></div>
            <div>
              <input
                type='number'
                value={paddingLeft ?? 0}
                onChange={(event) => handleStyleChanges(event.target.value, 'paddingLeft')}
              />
            </div>
            <div>
              <input
                type='number'
                value={paddingRight ?? 0}
                onChange={(event) => handleStyleChanges(event.target.value, 'paddingRight')}
              />
            </div>
            <div>
              <input
                type='number'
                value={paddingBottom ?? 0}
                onChange={(event) => handleStyleChanges(event.target.value, 'paddingBottom')}
              />
            </div>
          </PaddingBox>
          <div>
            <input
              type='number'
              value={marginLeft ?? 0}
              onChange={(event) => handleStyleChanges(event.target.value, 'marginLeft')}
            />
          </div>
          <div>
            <input
              type='number'
              value={marginRight ?? 0}
              onChange={(event) => handleStyleChanges(event.target.value, 'marginRight')}
            />
          </div>
          <div>
            <input
              type='number'
              value={marginBottom ?? 0}
              onChange={(event) => handleStyleChanges(event.target.value, 'marginBottom')}
            />
          </div>
        </SpacingBox>
      </CollapsibleSection>
    </div>
  );
}

function GridSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const { columns, rows, columnWidth, rowHeight, columnGap, rowGap } = useAppSelector(
    (state) => state.selection.present.selectedElement
  ) as GridElement;

  return (
    <div>
      <CollapsibleSection title='Grid' open={true}>
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
      </CollapsibleSection>
    </div>
  );
}

function LinkSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const selection = useAppSelector((state) => state.selection.present.selectedElement) as LinkElement;

  return (
    <div>
      <CollapsibleSection title='Link' open={true}>
        <div>
          <Input
            type='text'
            defaultValue={selection.link}
            placeholder='https://example.com'
            onChange={(e) => handleStyleChanges(e.target.value, 'link')}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

function InputSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const { type, placeholder } = useAppSelector((state) => state.selection.present.selectedElement) as InputElement;

  return (
    <div>
      <CollapsibleSection title='Input' open={true}>
        <GridContainer>
          <div>
            <SubTitle>Placeholder</SubTitle>
            <Input
              type='text'
              defaultValue={placeholder}
              placeholder='E-Mail'
              onChange={(e) => handleStyleChanges(e.target.value, 'placeholder')}
            />
          </div>
          <div>
            <SubTitle>Type</SubTitle>
            <Select
              editInputType='text'
              defaultSelect={type}
              options={OPTIONS_INPUT_TYPE}
              onChange={(option) => handleStyleChanges(option, 'type')}
            />
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function TypographySettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const selection = useAppSelector((state) => state.selection.present.selectedElement);

  return (
    <TypographyContainer>
      <CollapsibleSection title='Typography'>
        <div>
          <div>
            <SubTitle>Font Family</SubTitle>
            <Select
              defaultSelect={selection.fontFamily}
              options={OPTIONS_FONT}
              onChange={(option) => handleStyleChanges(option, 'fontFamily')}
            />
          </div>
          <GridContainer>
            <div>
              <SubTitle>Weight</SubTitle>
              <Select
                defaultSelect={selection.fontWeight}
                options={Object.keys(FONT_WEIGHT_VALUES)}
                onChange={(option) => handleStyleChanges(option, 'fontWeight')}
              />
            </div>
            <div>
              <SubTitle>Font Size</SubTitle>
              <Select
                editable
                editInputType='text'
                defaultSelect={selection.fontSize}
                options={OPTIONS_FONT_SIZE}
                onChange={(option) => handleStyleChanges(option, 'fontSize')}
              />
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <SubTitle>Color</SubTitle>
              <ColorPicker defaultValue={selection.color} propName='color' onChange={handleStyleChanges} />
            </div>
            <div>
              <SubTitle>Fill</SubTitle>
              <ColorPicker
                propName='backgroundColor'
                defaultValue={selection.backgroundColor}
                onChange={handleStyleChanges}
              />
            </div>
          </GridContainer>
          <div>
            <SubTitle>Text Align</SubTitle>
            <TextAlignContainer>
              <Icon icon={LuAlignLeft} onClick={() => handleStyleChanges('left', 'textAlign')} />
              <Icon icon={LuAlignRight} onClick={() => handleStyleChanges('right', 'textAlign')} />
              <Icon icon={LuAlignCenter} onClick={() => handleStyleChanges('center', 'textAlign')} />
              <Icon icon={LuAlignJustify} onClick={() => handleStyleChanges('justify', 'textAlign')} />
            </TextAlignContainer>
          </div>
        </div>
      </CollapsibleSection>
    </TypographyContainer>
  );
}

function StrokeSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const { borderTop, borderRight, borderBottom, borderLeft, borderColor, borderWidth } = useAppSelector(
    (state) => state.selection.present.selectedElement
  );

  const borders = { top: borderTop, right: borderRight, bottom: borderBottom, left: borderLeft };

  const toggleBorder = (side: BorderSide) => {
    const current = borders[side];

    const newValue = !current || current === 'none' ? `${borderWidth || DEFAULT_BORDER_WIDTH}px solid` : 'none';

    handleStyleChanges(newValue, `border${side.charAt(0).toUpperCase() + side.slice(1)}`);
    handleStyleChanges(borderColor || DEFAULT_BORDER_COLOR, 'borderColor');
  };

  return (
    <StrokeContainer>
      <CollapsibleSection title='Stroke'>
        <GridContainer>
          <div>
            <ColorPicker
              defaultValue={borderColor || DEFAULT_BORDER_COLOR}
              propName='borderColor'
              onChange={handleStyleChanges}
            />
          </div>
          <StrokeWidthContainer>
            <label>Stroke Width</label>
            <Input
              type='number'
              defaultValue={borderWidth || DEFAULT_BORDER_WIDTH}
              onChange={(e) => handleStyleChanges(e.target.value, 'borderWidth')}
            />
          </StrokeWidthContainer>
          <StrokePosition>
            {BORDER_SIDES.map(({ side, label, icon }) => (
              <BorderButton
                key={side}
                onClick={() => toggleBorder(side)}
                active={!!borders[side] && borders[side] !== 'none'}
              >
                <span>{label}</span>
                <Icon icon={icon} size='sm' />
              </BorderButton>
            ))}
          </StrokePosition>
        </GridContainer>
      </CollapsibleSection>
    </StrokeContainer>
  );
}
