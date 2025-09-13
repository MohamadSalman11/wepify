import { resolveAlignment, reverseResolveAlignment } from '@compiler/utils/resolveAlignment';
import { EditorToIframe, ElementsName } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import type { PageElement, PageElementAttrs, PageElementStyle } from '@shared/typing';
import { ComponentProps, createContext, ElementType, Fragment, useContext, useEffect, useState } from 'react';
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
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
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
import AppTooltip from '../../../components/AppTooltip';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import Icon from '../../../components/Icon';
import { useAppSelector } from '../../../store';
import { generateElementDisplayMap } from '../../../utils/generateElementDisplayMap';
import CollapsibleSection from '../CollapsibleSection';
import ColorPicker from '../ColorPicker';
import { selectCurrentElement, selectCurrentPage, selectCurrentPageElements } from '../editorSlice';
import { Settings, useSettingsVisibility } from '../hooks/useSettingsVisibility';
import { useStyle } from '../hooks/useStyle';

/**
 * Constants
 */

const PROPERTY_EDITOR_PREFIX = 'property-editor';

const DEFAULT_BORDER_RADIUS = 0;
const DEFAULT_BORDER_COLOR = '#3e7df5';
const DEFAULT_BORDER_WIDTH = 2;
const DEFAULT_COLOR = '#000000';
const DEFAULT_ALIGN_ITEMS = 'flex-start';
const DEFAULT_JUSTIFY_CONTENT = 'flex-start';
const DEFAULT_FLEX_DIRECTION = 'row';
const DEFAULT_TEXT_ALIGN = 'left';

const OPTIONS_COLUMN = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const OPTIONS_COLUMN_WIDTH = ['auto', 50, 100, 150, 200, 250, 300];
const OPTIONS_COLUMN_GAP = [2, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128];
const OPTIONS_ROW_GAP = OPTIONS_COLUMN_GAP;
const OPTIONS_ROW_HEIGHT = OPTIONS_COLUMN_WIDTH;
const OPTIONS_ROW = OPTIONS_COLUMN;
const OPTIONS_SPACE = ['between', 'around', 'evenly', 'none'];
const OPTIONS_FONT_SIZE = ['Inherit', 10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128];
const OPTIONS_SIZE = ['fill', 'auto', 50, 100, 150, 250, 500];
const OPTIONS_SPACE_VALUE = new Set(['between', 'around', 'evenly']);

const OPTIONS_BORDER = [
  { side: 'Top', icon: LuPanelTop },
  { side: 'Right', icon: LuPanelRight },
  { side: 'Bottom', icon: LuPanelBottom },
  { side: 'Left', icon: LuPanelLeft }
];

const OPTIONS_FLEX_DIRECTION = [
  { value: 'row', icon: LuArrowRight },
  { value: 'column', icon: LuArrowDown },
  { value: 'row-reverse', icon: LuArrowLeft },
  { label: 'Column Reverse', value: 'column-reverse', icon: LuArrowUp }
];

const OPTIONS_ALIGN_ITEM = [
  { icon: LuAlignStartVertical, label: 'Left', targetName: 'justifyContent', targetValue: 'flex-start' },
  { icon: LuAlignEndVertical, label: 'Right', targetName: 'justifyContent', targetValue: 'flex-end' },
  { icon: LuAlignStartHorizontal, label: 'Top', targetName: 'alignItems', targetValue: 'flex-start' },
  { icon: LuAlignEndHorizontal, label: 'Bottom', targetName: 'alignItems', targetValue: 'flex-end' },
  {
    icon: LuAlignHorizontalJustifyCenter,
    label: 'Center horizontally',
    targetName: 'justifyContent',
    targetValue: 'center'
  },
  { icon: LuAlignVerticalJustifyCenter, label: 'Center vertically', targetName: 'alignItems', targetValue: 'center' }
];

const OPTIONS_TEXT_ALIGN = [
  { value: 'left', icon: LuAlignLeft },
  { value: 'right', icon: LuAlignRight },
  { value: 'center', icon: LuAlignCenter },
  { value: 'justify', icon: LuAlignJustify }
];

export const OPTIONS_FONT = [
  'Inherit',
  'Inter',
  'JetBrains Mono',
  'Fira Code',
  'Lato',
  'Lora',
  'Merriweather',
  'Montserrat',
  'Nunito',
  'Open Sans',
  'Oswald',
  'Pacifico',
  'Playfair Display',
  'Poppins',
  'Raleway',
  'Roboto Slab',
  'Roboto',
  'Anta',
  'Rubik',
  'Savate',
  'Source Code Pro',
  'Amatic SC',
  'Ubuntu'
];

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

export const OPTIONS_CURSOR = [
  'default',
  'pointer',
  'text',
  'move',
  'crosshair',
  'not-allowed',
  'wait',
  'help',
  'grab',
  'grabbing'
] as const;

export const OPTIONS_CURSOR_PLAIN: string[] = [...OPTIONS_CURSOR];

export const FONT_WEIGHT_VALUES = {
  Inherit: 'inherit',
  Thin: '100',
  ExtraLight: '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  SemiBold: '600',
  Bold: '700',
  ExtraBold: '800',
  Black: '900'
};

/**
 * Types
 */

export type AlignmentName = 'alignItems' | 'justifyContent';
export type AlignmentValue = 'flex-start' | 'flex-end' | 'center';
export type FlexDirectionOption = 'row' | 'column' | 'row-reverse' | 'column-reverse';

type StyleProp = keyof PageElementStyle;
type BorderSide = 'Top' | 'Right' | 'Bottom' | 'Left';
type HandleElementChange = (updates: Partial<PageElement>) => void;
type PropertyEditorControlledProps = 'id' | 'value' | 'onChange' | 'onBlur';

interface SettingsContextProps {
  handleElementChange: HandleElementChange;
}

interface PropertyEditorBaseProps {
  type?: 'text' | 'number';
  label?: string;
  styleName?: StyleProp;
  attrName?: keyof NonNullable<PageElementAttrs>;
  fallbackValue?: string | number;
  wrapper?: ElementType;
}

type InputProps = PropertyEditorBaseProps & {
  as?: 'input';
} & Omit<ComponentProps<typeof Input>, PropertyEditorControlledProps>;

type SelectProps = PropertyEditorBaseProps & {
  as: 'select';
  defaultSelect?: string | number;
} & Omit<ComponentProps<typeof Select>, PropertyEditorControlledProps | 'defaultSelect'>;

type ColorPickerProps = PropertyEditorBaseProps & {
  as: 'colorPicker';
} & Omit<ComponentProps<typeof ColorPicker>, PropertyEditorControlledProps>;

type PropertyEditorProps = InputProps | SelectProps | ColorPickerProps;

/**
 * Component definition
 */

export default function SettingsPanel() {
  const { isVisible } = useSettingsVisibility();

  return (
    <SettingsContext.Provider value={{ handleElementChange }}>
      <SelectorSettings />
      {isVisible(Settings.Alignment) || <AlignmentSettings />}
      {isVisible(Settings.Size) || <SizeSettings />}
      {isVisible(Settings.Link) || <LinkSettings />}
      {isVisible(Settings.Input) || <InputSettings />}
      {isVisible(Settings.Grid) || <GridSettings />}
      {isVisible(Settings.Flex) || <FlexSettings />}
      {isVisible(Settings.Space) || <SpaceSettings />}
      {isVisible(Settings.Typography) || <TypographySettings />}
      {isVisible(Settings.Fill) || <FillSettings />}
      <CursorSettings />
      <StrokeSettings />
      <PageSettings />
    </SettingsContext.Provider>
  );
}

function SelectorSettings() {
  const selectedElement = useAppSelector(selectCurrentElement);
  const elements = useAppSelector(selectCurrentPageElements);
  const elementMap = generateElementDisplayMap(elements);
  const displayNames = Object.keys(elementMap);

  return (
    <div>
      <CollapsibleSection title='Selector' open>
        <SelectorContainer>
          <Icon icon={LuMonitor} />
          <Select
            name='selector'
            options={displayNames}
            defaultSelect={Object.keys(elementMap).find((key) => elementMap[key] === selectedElement.id)}
            onChange={(event) => iframeConnection.send(EditorToIframe.SelectElement, elementMap[event.target.value])}
          />
        </SelectorContainer>
      </CollapsibleSection>
    </div>
  );
}

function SizeSettings() {
  const style = useStyle();
  const { handleElementChange } = useSettingsContext();

  const handleRotate = () => {
    const current = style.rotate ?? 0;
    let newRotate = current - 90;
    if (newRotate <= -180) newRotate = 180;
    handleElementChange({ style: { rotate: newRotate } });
  };

  const handleFlipHorizontal = () => {
    const currentScaleX = style.scaleX ?? 1;
    const newScaleX = currentScaleX === 1 ? -1 : 1;
    handleElementChange({ style: { scaleX: newScaleX } });
  };

  const handleFlipVertical = () => {
    const currentScaleY = style.scaleY ?? 1;
    const newScaleY = currentScaleY === 1 ? -1 : 1;
    handleElementChange({ style: { scaleY: newScaleY } });
  };

  return (
    <div>
      <CollapsibleSection title='Size' open>
        <GridContainer>
          <SizeRow>
            <PropertyEditor as='input' styleName='left' type='number' label='X' wrapper={Fragment} />
          </SizeRow>
          <SizeRow>
            <PropertyEditor as='input' styleName='top' type='number' label='Y' wrapper={Fragment} />
          </SizeRow>
          <SizeRow>
            <PropertyEditor
              as='select'
              styleName='width'
              label='W'
              wrapper={Fragment}
              editable
              editInputType='text'
              options={OPTIONS_SIZE}
            />
          </SizeRow>
          <SizeRow>
            <PropertyEditor
              as='select'
              styleName='height'
              label='H'
              wrapper={Fragment}
              editable
              editInputType='text'
              options={['screen', ...OPTIONS_SIZE]}
            />
          </SizeRow>
          <SizeRow>
            <PropertyEditor as='input' styleName='rotate' type='number' label='R' wrapper={Fragment} />
          </SizeRow>
          <RotationContainer>
            <AppTooltip label='Rotate -90°' side='top' sideOffset={5} sizeSmall>
              <Icon icon={LuRotateCwSquare} onClick={handleRotate} />
            </AppTooltip>
            <AppTooltip label='Flip Horizontal' side='top' sideOffset={5} sizeSmall>
              <Icon icon={LuFlipHorizontal2} onClick={handleFlipHorizontal} />
            </AppTooltip>
            <AppTooltip label='Flip Vertical' side='top' sideOffset={5} sizeSmall>
              <Icon icon={LuFlipVertical2} onClick={handleFlipVertical} />
            </AppTooltip>
          </RotationContainer>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function AlignmentSettings() {
  const style = useStyle();
  const { handleElementChange } = useSettingsContext();
  const justifyContent = style.justifyContent || DEFAULT_JUSTIFY_CONTENT;
  const alignItems = style.alignItems || DEFAULT_ALIGN_ITEMS;
  const flexDirection = style.flexDirection || DEFAULT_FLEX_DIRECTION;

  const [resolvedJustifyName, resolvedJustifyValue] = reverseResolveAlignment(
    'justifyContent',
    justifyContent as AlignmentValue,
    flexDirection
  );

  const [resolvedAlignName, resolvedAlignValue] = reverseResolveAlignment(
    'alignItems',
    alignItems as AlignmentValue,
    flexDirection
  );

  return (
    <div>
      <CollapsibleSection title='Alignment' open>
        <AlignmentContainer>
          {OPTIONS_ALIGN_ITEM.map(({ icon, label, targetName, targetValue }) => {
            const isSelected =
              (targetName === resolvedJustifyName && targetValue === resolvedJustifyValue) ||
              (targetName === resolvedAlignName && targetValue === resolvedAlignValue);

            const [alignmentName, alignmentValue] = resolveAlignment(
              targetName as AlignmentName,
              targetValue as AlignmentValue,
              flexDirection
            );

            const handleClick = () => handleElementChange({ style: { [alignmentName]: alignmentValue } });

            return (
              <AppTooltip key={targetName + targetValue} label={label} side='top' sideOffset={5} sizeSmall>
                <Icon icon={icon} isSelected={isSelected} onClick={handleClick} />
              </AppTooltip>
            );
          })}
        </AlignmentContainer>
      </CollapsibleSection>
    </div>
  );
}

function FlexSettings() {
  const style = useStyle();
  const { handleElementChange } = useSettingsContext();
  const { justifyContent, flexDirection } = style;
  const jcValue = justifyContent?.replace(/^space-/, '') || '';
  const space = OPTIONS_SPACE_VALUE.has(jcValue) ? jcValue : 'none';

  const handleSelect = (value: FlexDirectionOption) => {
    handleElementChange({ style: { flexDirection: value } });
  };

  return (
    <div>
      <CollapsibleSection title='Flex'>
        <GridContainer>
          <PropertyEditor
            as='select'
            styleName='columnGap'
            type='number'
            label='Gap X'
            editable
            options={OPTIONS_COLUMN_GAP}
          />
          <PropertyEditor
            as='select'
            styleName='rowGap'
            type='number'
            label='Gap Y'
            editable
            options={OPTIONS_ROW_GAP}
          />
          <PropertyEditor
            as='select'
            styleName='justifyContent'
            label='Space'
            defaultSelect={space}
            options={OPTIONS_SPACE}
          />
          <div>
            <Label>Direction</Label>
            <DisplayOptionsWrapper>
              {OPTIONS_FLEX_DIRECTION.map(({ value, icon }) => (
                <AppTooltip key={value} label={value} side='top' sideOffset={5} sizeSmall>
                  <DisplayOptionButton
                    $active={flexDirection === value}
                    onClick={() => handleSelect(value as FlexDirectionOption)}
                  >
                    <Icon icon={icon} size='md' />
                  </DisplayOptionButton>
                </AppTooltip>
              ))}
            </DisplayOptionsWrapper>
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function SpaceSettings() {
  return (
    <div>
      <CollapsibleSection title='Spacing'>
        <SpaceBox>
          <PropertyEditor as='input' styleName='marginTop' type='number' />
          <PaddingBox>
            <PropertyEditor as='input' styleName='paddingTop' type='number' />
            <div>&nbsp;</div>
            <PropertyEditor as='input' styleName='paddingLeft' type='number' />
            <PropertyEditor as='input' styleName='paddingRight' type='number' />
            <PropertyEditor as='input' styleName='paddingBottom' type='number' />
          </PaddingBox>
          <PropertyEditor as='input' styleName='marginLeft' type='number' />
          <PropertyEditor as='input' styleName='marginRight' type='number' />
          <PropertyEditor as='input' styleName='marginBottom' type='number' />
        </SpaceBox>
      </CollapsibleSection>
    </div>
  );
}

function GridSettings() {
  return (
    <div>
      <CollapsibleSection title='Grid' open>
        <GridContainer>
          <PropertyEditor as='select' styleName='columns' label='Columns' editable options={OPTIONS_COLUMN} />
          <PropertyEditor as='select' styleName='rows' label='Rows' editable options={OPTIONS_ROW} />
          <PropertyEditor
            as='select'
            styleName='columnWidth'
            label='Width'
            fallbackValue='auto'
            editable
            editInputType='text'
            options={OPTIONS_COLUMN_WIDTH}
          />
          <PropertyEditor
            as='select'
            styleName='rowHeight'
            label='Height'
            fallbackValue='auto'
            editable
            editInputType='text'
            options={OPTIONS_ROW_HEIGHT}
          />
          <PropertyEditor
            as='select'
            styleName='columnGap'
            label='Gap X'
            editable
            editInputType='text'
            options={OPTIONS_COLUMN_GAP}
          />
          <PropertyEditor
            as='select'
            styleName='rowGap'
            label='Gap Y'
            editable
            editInputType='text'
            options={OPTIONS_ROW_GAP}
          />
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function LinkSettings() {
  return (
    <div>
      <CollapsibleSection title='Link' open>
        <PropertyEditor as='input' attrName='href' placeholder='https://example.com' />
      </CollapsibleSection>
    </div>
  );
}

function InputSettings() {
  return (
    <div>
      <CollapsibleSection title='Input' open>
        <GridContainer>
          <PropertyEditor as='input' attrName='placeholder' type='text' label='Placeholder' />
          <PropertyEditor as='select' attrName='type' label='Type' editInputType='text' options={OPTIONS_INPUT_TYPE} />
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function TypographySettings() {
  const name = useAppSelector(selectCurrentElement).name;
  const { handleElementChange } = useSettingsContext();
  const { textAlign } = useStyle();
  const showTextAlign = [ElementsName.Heading, ElementsName.Text, ElementsName.Link, ElementsName.Input].includes(name);

  return (
    <TypographyContainer>
      <CollapsibleSection title='Typography'>
        <PropertyEditor as='select' styleName='fontFamily' label='Font Family' options={OPTIONS_FONT} />
        <GridContainer>
          <PropertyEditor as='select' styleName='fontWeight' label='Weight' options={Object.keys(FONT_WEIGHT_VALUES)} />
          <PropertyEditor
            as='select'
            styleName='fontSize'
            label='Font Size'
            editable
            editInputType='text'
            options={OPTIONS_FONT_SIZE}
          />
        </GridContainer>
        <PropertyEditor as='colorPicker' styleName='color' label='Color' fallbackValue={DEFAULT_COLOR} />
        {showTextAlign && (
          <div>
            <Label>Text Align</Label>
            <TextAlignContainer>
              {OPTIONS_TEXT_ALIGN.map(({ value, icon }) => (
                <AppTooltip key={value} label={value} side='top' sideOffset={5} sizeSmall>
                  <Icon
                    icon={icon}
                    isSelected={(textAlign || DEFAULT_TEXT_ALIGN) === value}
                    onClick={() => handleElementChange({ style: { textAlign: value } })}
                  />
                </AppTooltip>
              ))}
            </TextAlignContainer>
          </div>
        )}
      </CollapsibleSection>
    </TypographyContainer>
  );
}

function FillSettings() {
  return (
    <div>
      <CollapsibleSection title='Fill'>
        <PropertyEditor as='colorPicker' styleName='backgroundColor' label='Background Color' />
      </CollapsibleSection>
    </div>
  );
}

function CursorSettings() {
  const style = useStyle();

  return (
    <div>
      <CollapsibleSection title='Cursor'>
        <PropertyEditor
          as='select'
          styleName='cursor'
          label='Type'
          defaultSelect={style.cursor || 'default'}
          options={OPTIONS_CURSOR_PLAIN}
        />
      </CollapsibleSection>
    </div>
  );
}

function StrokeSettings() {
  const {
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderColor = DEFAULT_BORDER_COLOR,
    borderWidth = DEFAULT_BORDER_WIDTH
  } = useStyle();
  const { handleElementChange } = useSettingsContext();

  const borders = { borderTop, borderRight, borderBottom, borderLeft };

  const toggleBorder = (side: BorderSide, value: string) => {
    const border = `border${side}`;
    const currentBorderValue = borders[border as keyof typeof borders];

    if (currentBorderValue?.includes('none') || !currentBorderValue) {
      handleElementChange({ style: { [border]: value } });
    } else {
      handleElementChange({ style: { [border]: 'none' } });
    }
  };

  return (
    <div>
      <CollapsibleSection title='Stroke'>
        <GridContainer>
          <PropertyEditor as='colorPicker' styleName='borderColor' fallbackValue={DEFAULT_BORDER_COLOR} />
          <StrokeWidthContainer>
            <StrokeLabel htmlFor={`${PROPERTY_EDITOR_PREFIX}-input-borderWidth`}>width</StrokeLabel>
            <PropertyEditor
              as='input'
              styleName='borderWidth'
              type='number'
              wrapper={Fragment}
              fallbackValue={DEFAULT_BORDER_WIDTH}
            />
          </StrokeWidthContainer>
          <StrokeWidthContainer>
            <StrokeLabel htmlFor={`${PROPERTY_EDITOR_PREFIX}-input-borderRadius`}>radius</StrokeLabel>
            <PropertyEditor
              as='input'
              styleName='borderRadius'
              type='number'
              wrapper={Fragment}
              fallbackValue={DEFAULT_BORDER_RADIUS}
            />
          </StrokeWidthContainer>
          <StrokePosition>
            {OPTIONS_BORDER.map(({ side, icon }) => {
              const border = `border${side}` as keyof typeof borders;

              return (
                <AppTooltip key={side} label={side} side='top' sideOffset={5} sizeSmall>
                  <Icon
                    icon={icon}
                    size='md'
                    isSelected={!borders[border]?.includes('none') && borders[border] !== undefined}
                    onClick={() => toggleBorder(side as BorderSide, `${borderWidth}px solid ${borderColor}`)}
                  />
                </AppTooltip>
              );
            })}
          </StrokePosition>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function PageSettings() {
  const backgroundColor = useAppSelector(selectCurrentPage).backgroundColor;

  return (
    <div>
      <CollapsibleSection title='Page'>
        <Label>Background Color</Label>
        <div>
          <div>
            <ColorPicker
              defaultValue={backgroundColor}
              onChange={(event) => {
                iframeConnection.send(EditorToIframe.UpdatePage, { backgroundColor: event.target.value as string });
              }}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function PropertyEditor({
  as = 'input',
  type = 'text',
  label,
  styleName,
  attrName,
  fallbackValue,
  wrapper: Wrapper = 'div',
  ...props
}: PropertyEditorProps) {
  const { handleElementChange } = useSettingsContext();
  const currentEl = useAppSelector(selectCurrentElement);
  const style = useStyle();
  const attrs = currentEl.attrs || {};
  const [value, setValue] = useState(getCurrentValue);

  function getCurrentValue() {
    const val = styleName ? style[styleName] : attrName ? attrs[attrName] : '';

    if (val === undefined || val === '') {
      return fallbackValue === undefined ? (type === 'number' ? 0 : '') : fallbackValue;
    }

    return parseNumber(val) ?? (type === 'number' ? 0 : '');
  }

  useEffect(() => {
    setValue(getCurrentValue());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEl.id, styleName ? style[styleName] : null, attrName ? attrs[attrName] : null]);

  const id = `${PROPERTY_EDITOR_PREFIX}-${as}-${styleName || attrName}`;

  const commonProps = {
    id,
    value,
    onBlur: () => setValue(getCurrentValue()),
    onChange: (event: any) => {
      let value: string | number = event.target.value;
      const isLink = attrName === 'href';
      const isEmpty = typeof value === 'string' && value.trim() === '';

      setValue(value);

      if (isEmpty && !isLink) return;

      if (type === 'number' && !isEmpty) {
        value = Number(value);
      }

      if (styleName) handleElementChange({ style: { [styleName]: value } });
      if (attrName) handleElementChange({ attrs: { [attrName]: value } });
    }
  };

  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      {as === 'select' && (
        <Select
          {...commonProps}
          {...(props as SelectProps)}
          defaultSelect={(props as SelectProps).defaultSelect ?? getCurrentValue()}
        />
      )}
      {as === 'colorPicker' && (
        <ColorPicker {...commonProps} {...(props as ColorPickerProps)} defaultValue={getCurrentValue() as string} />
      )}
      {as === 'input' && (
        <Input {...commonProps} {...(props as InputProps)} type={type} spellCheck={false} autoComplete='off' />
      )}
    </Wrapper>
  );
}

const parseNumber = (value: number | string | undefined) => {
  if (!value) {
    return;
  }

  if (typeof value === 'string' && Number.isNaN(Number.parseFloat(value))) {
    return value;
  }

  const parsedValue = typeof value === 'string' ? Number.parseFloat(value) : value;
  const parts = parsedValue.toString().split('.');

  if (parts.length > 1 && parts[1].length > 2) {
    return parsedValue.toFixed(2);
  }

  return parsedValue;
};

const handleElementChange: HandleElementChange = (updates) => {
  iframeConnection.send(EditorToIframe.UpdateElement, updates);
};

const SettingsContext = createContext<SettingsContextProps | null>(null);

const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('Settings panel components must be used within <SettingsPanel>');
  }

  return context;
};

/**
 * Styles
 */

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const StrokeWidthContainer = styled.div`
  position: relative;

  input {
    padding-left: 1.2rem;
    width: 100%;
  }
`;

const Label = styled.label`
  display: inline-block;
  margin-bottom: 1.2rem;
  color: var(--color-gray-light-2);
  font-size: 1.2rem;
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
  column-gap: 1.2rem;
  justify-content: center;
  margin-top: 1.2rem;
`;

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 1.2rem;
`;

const SizeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 1.6rem;
  color: var(--color-gray);

  label {
    margin: 0;
  }
`;

const TypographyContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3.2rem;
`;

const SpaceBox = styled.div`
  width: 100%;
  height: 17rem;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(5, 1fr);
  border-radius: var(--border-radius-lg);
  border: 1px dashed var(--color-gray-light-4);
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
    padding: 0;
    width: 2.6rem;
    text-align: center;
  }
`;

const PaddingBox = styled.div`
  grid-row: 2 / 5;
  grid-column: 2 / 8;
  border: 2px solid var(--color-primary-light);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-gray-light-4);
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
  justify-content: space-between;
  align-items: center;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white-3);
  padding: 0.8rem;
`;

const TextAlignContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white-3);
  padding: 0.8rem;
`;

const RotationContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.4rem;
  margin-left: auto;
`;

const DisplayOptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 0.2rem;
  background-color: var(--color-white-3);
  padding: 0.6rem;
  border-radius: var(--border-radius-md);
  width: 100%;
`;

const DisplayOptionButton = styled.button<{ $active: boolean }>`
  padding: 0.2rem 0.4rem;
  border: none;
  border-radius: var(--border-radius-md);
  background-color: ${(props) => (props.$active ? 'var(--color-gray-light-3)' : 'transparent')};
  color: var(--color-black-light);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-gray-light-3);
  }
`;
