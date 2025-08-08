import * as Tooltip from '@radix-ui/react-tooltip';
import {
  DEFAULT_BORDER_COLOR,
  DEFAULT_BORDER_WIDTH,
  ElementsName,
  FONT_WEIGHT_VALUES,
  OPTIONS_FONT,
  SPACE_VALUES,
  Tags
} from '@shared/constants';
import { resolveAlignment, reverseResolveAlignment } from '@shared/helpers';
import type {
  AlignmentName,
  AlignmentValue,
  DeviceType,
  FlexDirectionOption,
  GridElement,
  InputElement,
  LinkElement,
  PageElement
} from '@shared/typing';
import { isElementName } from '@shared/utils';
import { cloneElement, createContext, useContext, type ChangeEvent, type ReactElement } from 'react';
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
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import Icon from '../../../components/Icon';
import { useIframeContext } from '../../../context/IframeContext';
import { useAppSelector } from '../../../store';
import { flattenElements } from '../../../utils/flattenElements';
import { getResponsiveValue } from '../../../utils/getResponsiveValue';
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
const OPTIONS_SPACE = ['between', 'around', 'evenly', 'none'];
const OPTIONS_FONT_SIZE = ['Inherit', 10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128];
const OPTIONS_SIZE = ['fill', 'auto', 50, 100, 150, 250, 500];
const DEFAULT_BORDER_RADIUS = 0;

const REGEX_TRAILING_NUMBER_SPLIT = /-(\d+)$/;

const OPTIONS_FLEX_DIRECTION = [
  { value: 'row', icon: LuArrowRight },
  { value: 'column', icon: LuArrowDown },
  { value: 'row-reverse', icon: LuArrowLeft },
  { label: 'Column Reverse', value: 'column-reverse', icon: LuArrowUp }
] as const;

const BORDER_SIDES = [
  { side: 'Top', icon: LuPanelTop },
  { side: 'Right', icon: LuPanelRight },
  { side: 'Bottom', icon: LuPanelBottom },
  { side: 'Left', icon: LuPanelLeft }
] as const;

const ALIGN_ITEMS = [
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

interface SettingsContextType {
  handleElementChange: (name: string, value: string | number) => void;
}

/**
 * Component definition
 */

export default function SettingsPanel() {
  const { iframeConnection } = useIframeContext();
  const { selectedElement, deviceType } = useAppSelector((state) => state.editor);

  const handleElementChange = (name: string, value: string | number) => {
    const updates = { [name]: value };

    if (isElementName(selectedElement.name, ElementsName.Grid)) {
      Object.assign(updates, getSynchronizedGridUpdates(name, selectedElement as GridElement, deviceType));
    } else {
      Object.assign(updates, getSynchronizedFlex(name, value, selectedElement, deviceType));
    }

    Object.assign(updates, getSynchronizedTransform(name, selectedElement, deviceType));

    iframeConnection.updateElement(updates);
  };

  return (
    <SettingsContext.Provider value={{ handleElementChange }}>
      <SelectorSettings />
      <AlignmentSettings />
      <SizeSettings />
      {!isElementName(selectedElement.name, ElementsName.Grid) || <GridSettings />}
      {isElementName(selectedElement.name, ElementsName.Link) && <LinkSettings />}
      {isElementName(selectedElement.name, ElementsName.Input) && <InputSettings />}
      <FlexSettings />
      <SpacingSettings />
      <TypographySettings />
      {isElementName(selectedElement.name, ElementsName.Section) || <StrokeSettings />}
      <PageSettings />
    </SettingsContext.Provider>
  );
}

function ChangeElement({
  children,
  handler
}: {
  children: ReactElement<{
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  }>;
  handler?: (value: string | number) => void;
}) {
  const { handleElementChange } = useSettingsContext();

  return cloneElement(children, {
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      handler?.(event.target.value);
      handleElementChange(event.target.name, event.target.value);
    }
  });
}

function SelectorSettings() {
  const { pageId } = useParams();
  const { site, selectedElement } = useAppSelector((state) => state.editor);
  const page = site.pages.find((p) => p.id === pageId);
  const { iframeConnection } = useIframeContext();

  const sortedElementIds = flattenElements(page?.elements || [])
    .map((el) => el.id)
    .sort((a, b) => {
      const [aBase, aNum] = a.split(REGEX_TRAILING_NUMBER_SPLIT);
      const [bBase, bNum] = b.split(REGEX_TRAILING_NUMBER_SPLIT);

      if (aBase !== bBase) return aBase.localeCompare(bBase);
      return Number(aNum) - Number(bNum);
    });

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
            options={sortedElementIds}
            defaultSelect={selectedElement.id}
            onChange={(event) => handleSelection(event.target.value as string)}
          />
        </SelectorContainer>
      </CollapsibleSection>
    </div>
  );
}

function SizeSettings() {
  const { handleElementChange } = useSettingsContext();
  const { selectedElement, deviceType } = useAppSelector((state) => state.editor);
  const disableInput = isElementName(selectedElement.name, ElementsName.Item, ElementsName.Section);

  const handleRotate = () => {
    const current = getResponsiveValue(selectedElement.rotate, deviceType) ?? 0;
    let newRotate = current - 90;
    if (newRotate <= -180) newRotate = 180;
    handleElementChange('rotate', newRotate);
  };

  const handleFlipHorizontal = () => {
    const currentScaleX = getResponsiveValue(selectedElement.scaleX, deviceType) ?? 1;
    const newScaleX = currentScaleX === 1 ? -1 : 1;
    handleElementChange('scaleX', newScaleX);
  };

  const handleFlipVertical = () => {
    const currentScaleY = getResponsiveValue(selectedElement.scaleY, deviceType) ?? 1;
    const newScaleY = currentScaleY === 1 ? -1 : 1;
    handleElementChange('scaleY', newScaleY);
  };

  if (isElementName(selectedElement.name, ElementsName.Item)) {
    return null;
  }

  return (
    <div>
      <CollapsibleSection title='Size' open={true}>
        <GridContainer>
          <SizeRow>
            <label htmlFor='settings-panel-input-left'>X</label>
            <ChangeElement>
              <Input
                id='settings-panel-input-left'
                name='left'
                disabled={disableInput}
                type='number'
                value={disableInput ? '' : parseNumber(getResponsiveValue(selectedElement.left, deviceType))}
              />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label htmlFor='settings-panel-input-top'>Y</label>
            <ChangeElement>
              <Input
                id='settings-panel-input-top'
                name='top'
                disabled={disableInput}
                type='number'
                value={disableInput ? '' : parseNumber(getResponsiveValue(selectedElement.top, deviceType))}
              />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label htmlFor='settings-panel-input-width'>W</label>
            <ChangeElement>
              <Select
                id='settings-panel-input-width'
                name='width'
                editable
                editInputType='text'
                options={OPTIONS_SIZE}
                disabled={disableInput}
                defaultSelect={disableInput ? '' : parseNumber(getResponsiveValue(selectedElement.width, deviceType))}
              />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label htmlFor='settings-panel-input-height'>H</label>
            <ChangeElement>
              <Select
                id='settings-panel-input-height'
                name='height'
                editable
                editInputType='text'
                options={OPTIONS_SIZE}
                defaultSelect={parseNumber(getResponsiveValue(selectedElement.height, deviceType))}
              />
            </ChangeElement>
          </SizeRow>
          <SizeRow>
            <label htmlFor='settings-panel-input-rotate'>R</label>
            <ChangeElement>
              <Input
                id='settings-panel-input-rotate'
                name='rotate'
                type='text'
                disabled={disableInput}
                value={disableInput ? '' : (parseNumber(getResponsiveValue(selectedElement.rotate, deviceType)) ?? 0)}
              />
            </ChangeElement>
          </SizeRow>
          <RotationContainer>
            <Icon icon={LuRotateCwSquare} disabled={disableInput} onClick={handleRotate} />
            <Icon icon={LuFlipHorizontal2} disabled={disableInput} onClick={handleFlipHorizontal} />
            <Icon icon={LuFlipVertical2} disabled={disableInput} onClick={handleFlipVertical} />
          </RotationContainer>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function AlignmentSettings() {
  const { selectedElement, deviceType } = useAppSelector((state) => state.editor);
  const { handleElementChange } = useSettingsContext();
  const justifyContent = getResponsiveValue(selectedElement.justifyContent, deviceType) || 'flex-start';
  const alignItems = getResponsiveValue(selectedElement.alignItems, deviceType) || 'flex-start';
  const flexDirection = getResponsiveValue(selectedElement.flexDirection, deviceType) || 'column';

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

  if (
    isElementName(selectedElement.name, ElementsName.Grid, ElementsName.Image, ElementsName.Input) ||
    selectedElement.tag === Tags.Li.toLocaleLowerCase()
  ) {
    return null;
  }

  return (
    <div>
      <CollapsibleSection title='Alignment' open={true}>
        <AlignmentContainer>
          {ALIGN_ITEMS.map(({ icon, label, targetName, targetValue }) => {
            const isSelected =
              (targetName === resolvedJustifyName && targetValue === resolvedJustifyValue) ||
              (targetName === resolvedAlignName && targetValue === resolvedAlignValue);

            const handleClick = () =>
              handleElementChange(
                ...resolveAlignment(targetName as AlignmentName, targetValue as AlignmentValue, flexDirection)
              );

            return (
              <Tooltip.Root key={targetName + targetValue}>
                <Tooltip.Trigger asChild>
                  <Icon icon={icon} isSelected={isSelected} onClick={handleClick} />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className='TooltipContent TooltipSmall' side='top'>
                    {label}
                    <Tooltip.Arrow className='TooltipArrow' />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </AlignmentContainer>
      </CollapsibleSection>
    </div>
  );
}

function FlexSettings() {
  const { selectedElement, deviceType } = useAppSelector((state) => state.editor);
  const { handleElementChange } = useSettingsContext();
  const rowGap = getResponsiveValue(selectedElement.rowGap, deviceType) ?? 0;
  const columnGap = getResponsiveValue(selectedElement.columnGap, deviceType) ?? 0;
  const justifyContent = getResponsiveValue(selectedElement.justifyContent, deviceType);
  const jcValue = justifyContent?.replace(/^space-/, '') || '';
  const space = SPACE_VALUES.includes(jcValue) ? jcValue : 'none';

  const selectedDisplay: FlexDirectionOption =
    getResponsiveValue(selectedElement.flexDirection, deviceType) || 'column';

  const handleSelect = (value: FlexDirectionOption) => {
    handleElementChange('flexDirection', value);
  };

  if (
    isElementName(
      selectedElement.name,
      ElementsName.Grid,
      ElementsName.Heading,
      ElementsName.Text,
      ElementsName.Link,
      ElementsName.Input,
      ElementsName.Image
    ) ||
    selectedElement.tag === Tags.Li.toLocaleLowerCase()
  ) {
    return null;
  }

  return (
    <div>
      <CollapsibleSection title='Flex'>
        <GridContainer>
          <div>
            <SubTitle>Gap X</SubTitle>
            <ChangeElement>
              <Select name='columnGap' editable defaultSelect={columnGap} options={OPTIONS_COLUMN} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Gap Y</SubTitle>
            <ChangeElement>
              <Select name='rowGap' editable defaultSelect={rowGap} options={OPTIONS_ROW} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Space</SubTitle>
            <ChangeElement>
              <Select name='justifyContent' defaultSelect={space} options={OPTIONS_SPACE} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Direction</SubTitle>
            <DisplayOptionsWrapper>
              {OPTIONS_FLEX_DIRECTION.map(({ value, icon }) => (
                <Tooltip.Root key={value}>
                  <Tooltip.Trigger asChild>
                    <DisplayOptionButton
                      $active={selectedDisplay === value}
                      onClick={() => handleSelect(value as FlexDirectionOption)}
                    >
                      <Icon icon={icon} size='md' />
                    </DisplayOptionButton>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className='TooltipContent TooltipSmall' side='top'>
                      {value}
                      <Tooltip.Arrow className='TooltipArrow' />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </DisplayOptionsWrapper>
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function SpacingSettings() {
  const { selectedElement, deviceType } = useAppSelector((state) => state.editor);
  const {
    name,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
  } = selectedElement;

  if (isElementName(name, ElementsName.Image)) {
    return null;
  }

  return (
    <div>
      <CollapsibleSection title='Spacing'>
        <SpacingBox>
          <div>
            <ChangeElement>
              <input name='marginTop' type='number' value={getResponsiveValue(marginTop, deviceType) ?? 0} />
            </ChangeElement>
          </div>
          <PaddingBox>
            <div>
              <ChangeElement>
                <input name='paddingTop' type='number' value={getResponsiveValue(paddingTop, deviceType) ?? 0} />
              </ChangeElement>
            </div>
            <div></div>
            <div>
              <ChangeElement>
                <input name='paddingLeft' type='number' value={getResponsiveValue(paddingLeft, deviceType) ?? 0} />
              </ChangeElement>
            </div>
            <div>
              <ChangeElement>
                <input name='paddingRight' type='number' value={getResponsiveValue(paddingRight, deviceType) ?? 0} />
              </ChangeElement>
            </div>
            <div>
              <ChangeElement>
                <input name='paddingBottom' type='number' value={getResponsiveValue(paddingBottom, deviceType) ?? 0} />
              </ChangeElement>
            </div>
          </PaddingBox>
          <div>
            <ChangeElement>
              <input name='marginLeft' type='number' value={getResponsiveValue(marginLeft, deviceType) ?? 0} />
            </ChangeElement>
          </div>
          <div>
            <ChangeElement>
              <input name='marginRight' type='number' value={getResponsiveValue(marginRight, deviceType) ?? 0} />
            </ChangeElement>
          </div>
          <div>
            <ChangeElement>
              <input name='marginBottom' type='number' value={getResponsiveValue(marginBottom, deviceType) ?? 0} />
            </ChangeElement>
          </div>
        </SpacingBox>
      </CollapsibleSection>
    </div>
  );
}

function GridSettings() {
  const { selectedElement, deviceType } = useAppSelector((state) => state.editor);
  const { columns, rows, columnWidth, rowHeight, columnGap, rowGap } = selectedElement as GridElement;

  return (
    <div>
      <CollapsibleSection title='Grid' open={true}>
        <GridContainer>
          <div>
            <SubTitle>Columns</SubTitle>
            <ChangeElement>
              <Select
                name='columns'
                editable
                defaultSelect={getResponsiveValue(columns, deviceType)}
                options={OPTIONS_COLUMN}
              />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Rows</SubTitle>
            <ChangeElement>
              <Select name='rows' editable defaultSelect={getResponsiveValue(rows, deviceType)} options={OPTIONS_ROW} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Width</SubTitle>
            <ChangeElement>
              <Select
                name='columnWidth'
                editable
                editInputType='text'
                defaultSelect={getResponsiveValue(columnWidth, deviceType)}
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
                defaultSelect={getResponsiveValue(rowHeight, deviceType)}
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
                defaultSelect={getResponsiveValue(columnGap, deviceType)}
                options={OPTIONS_COLUMN_GAP}
              />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Gap Y</SubTitle>
            <ChangeElement>
              <Select
                name='rowGap'
                editable
                editInputType='text'
                defaultSelect={getResponsiveValue(rowGap, deviceType)}
                options={OPTIONS_ROW_GAP}
              />
            </ChangeElement>
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function LinkSettings() {
  const selectedElement = useAppSelector((state) => state.editor.selectedElement) as LinkElement;

  return (
    <div>
      <CollapsibleSection title='Link' open={true}>
        <div>
          <ChangeElement>
            <Input name='link' type='text' defaultValue={selectedElement.link} placeholder='https://example.com' />
          </ChangeElement>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function InputSettings() {
  const { type, placeholder } = useAppSelector((state) => state.editor.selectedElement) as InputElement;

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
  const { selectedElement, deviceType } = useAppSelector((state) => state.editor);
  const { handleElementChange } = useSettingsContext();
  const textAlign = getResponsiveValue(selectedElement.textAlign, deviceType);

  if (isElementName(selectedElement.name, ElementsName.Image)) {
    return null;
  }

  return (
    <TypographyContainer>
      <CollapsibleSection title='Typography'>
        <div>
          <SubTitle>Font Family</SubTitle>
          <ChangeElement>
            <Select name='fontFamily' defaultSelect={selectedElement.fontFamily} options={OPTIONS_FONT} />
          </ChangeElement>
        </div>
        <GridContainer>
          <div>
            <SubTitle>Weight</SubTitle>
            <ChangeElement>
              <Select
                name='fontWeight'
                defaultSelect={selectedElement.fontWeight}
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
                defaultSelect={getResponsiveValue(selectedElement.fontSize, deviceType)}
                options={OPTIONS_FONT_SIZE}
              />
            </ChangeElement>
          </div>
        </GridContainer>
        <GridContainer>
          <div>
            <SubTitle>Color</SubTitle>
            <ChangeElement>
              <ColorPicker name='color' defaultValue={selectedElement.color} />
            </ChangeElement>
          </div>
          <div>
            <SubTitle>Fill</SubTitle>
            <ChangeElement>
              <ColorPicker name='backgroundColor' defaultValue={selectedElement.backgroundColor} />
            </ChangeElement>
          </div>
        </GridContainer>
        <div>
          <SubTitle>Text Align</SubTitle>
          <TextAlignContainer>
            <Icon
              icon={LuAlignLeft}
              isSelected={textAlign === 'left'}
              onClick={() => handleElementChange('textAlign', 'left')}
            />
            <Icon
              icon={LuAlignRight}
              isSelected={textAlign === 'right'}
              onClick={() => handleElementChange('textAlign', 'right')}
            />
            <Icon
              icon={LuAlignCenter}
              isSelected={textAlign === 'center'}
              onClick={() => handleElementChange('textAlign', 'center')}
            />
            <Icon
              icon={LuAlignJustify}
              isSelected={textAlign === 'justify'}
              onClick={() => handleElementChange('textAlign', 'justify')}
            />
          </TextAlignContainer>
        </div>
      </CollapsibleSection>
    </TypographyContainer>
  );
}

function StrokeSettings() {
  const {
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderRadius = DEFAULT_BORDER_RADIUS,
    borderColor = DEFAULT_BORDER_COLOR,
    borderWidth = DEFAULT_BORDER_WIDTH
  } = useAppSelector((state) => state.editor.selectedElement);
  const { handleElementChange } = useSettingsContext();

  const borders = { borderTop, borderRight, borderBottom, borderLeft };

  const toggleBorder = (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: string) => {
    const border = `border${side}`;
    const currentBorderValue = borders[border as keyof typeof borders];

    if (currentBorderValue?.includes('none') || !currentBorderValue) {
      handleElementChange(border, value);
    } else {
      handleElementChange(border, 'none');
    }
  };

  return (
    <div>
      <CollapsibleSection title='Stroke'>
        <GridContainer>
          <div>
            <ChangeElement>
              <ColorPicker
                name='borderColor'
                defaultValue={borderColor}
                onChange={(event) => handleElementChange('borderColor', event.target.value)}
              />
            </ChangeElement>
          </div>
          <StrokeWidthContainer>
            <StrokeLabel>width</StrokeLabel>
            <ChangeElement>
              <Input
                name='borderWidth'
                type='number'
                defaultValue={borderWidth}
                onChange={(event) => handleElementChange('borderWidth', event.target.value)}
              />
            </ChangeElement>
          </StrokeWidthContainer>
          <StrokeWidthContainer>
            <StrokeLabel>radius</StrokeLabel>
            <ChangeElement>
              <Input
                name='borderRadius'
                type='number'
                defaultValue={borderRadius}
                onChange={(event) => handleElementChange('borderRadius', event.target.value)}
              />
            </ChangeElement>
          </StrokeWidthContainer>
          <StrokePosition>
            {BORDER_SIDES.map(({ side, icon }) => (
              <Icon
                key={side}
                icon={icon}
                size='md'
                isSelected={!borders[`border${side}`]?.includes('none') && borders[`border${side}`] !== undefined}
                onClick={() => toggleBorder(side, `${borderWidth}px solid ${borderColor}`)}
              />
            ))}
          </StrokePosition>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function PageSettings() {
  const { iframeConnection } = useIframeContext();
  const backgroundColor = useAppSelector((state) => state.page.backgroundColor);

  return (
    <div>
      <CollapsibleSection title='Page'>
        <SubTitle>Background Color</SubTitle>
        <div>
          <div>
            <ColorPicker
              name='pageBackground'
              defaultValue={backgroundColor}
              onChange={(event) => {
                iframeConnection.updatePage({ backgroundColor: event.target.value });
              }}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

const getSynchronizedGridUpdates = (propName: string, selectedElement: GridElement, deviceType: DeviceType) => {
  const updates = {} as any;

  if (propName === 'columnWidth') {
    updates.columns = selectedElement.columns[deviceType];
  }

  if (propName === 'columns') {
    updates.columnWidth = selectedElement.columnWidth[deviceType];
  }

  if (propName === 'rowHeight') {
    updates.rows = selectedElement.rows[deviceType];
  }

  if (propName === 'rows') {
    updates.rowHeight = selectedElement.rowHeight[deviceType];
  }

  return updates;
};

const parseNumber = (value: number | string | undefined) => {
  if (!value || typeof value === 'string') return value;

  return Number(value.toFixed(0));
};

const getSynchronizedTransform = (name: string, selectedElement: PageElement, deviceType: DeviceType) => {
  const updates: any = {};

  if (name === 'left') {
    updates.top = selectedElement.top[deviceType];
    updates.rotate = selectedElement.rotate?.[deviceType] || 0;
  }

  if (name === 'top') {
    updates.left = selectedElement.left[deviceType];
    updates.rotate = selectedElement.rotate?.[deviceType] || 0;
  }

  if (name === 'rotate') {
    updates.left = selectedElement.left[deviceType];
    updates.top = selectedElement.top[deviceType];
  }

  return updates;
};

const getSynchronizedFlex = (
  name: string,
  value: string | number,
  selectedElement: PageElement,
  deviceType: DeviceType
) => {
  const updates: any = {};

  if (isElementName(name, 'justifyContent', 'alignItems', 'columnGap', 'rowGap')) {
    updates.display = 'flex';
    updates.flexDirection = selectedElement.flexDirection?.[deviceType] ?? 'column';
  }

  if (isElementName(name, 'justifyContent') && value === 'none') {
    updates.justifyContent = 'center';
  }

  if (isElementName(name, 'flexDirection')) {
    const currentFlexDirection = getResponsiveValue(selectedElement.flexDirection, deviceType);
    const newFlexDirection = value as FlexDirectionOption;
    const currentAlignItems = getResponsiveValue(selectedElement.alignItems, deviceType) || 'flex-start';
    const currentJustifyContent = getResponsiveValue(selectedElement.justifyContent, deviceType) || 'flex-start';

    const [resolvedAlignName, resolvedAlignValue] = resolveAlignment(
      ...reverseResolveAlignment('alignItems', currentAlignItems as AlignmentValue, currentFlexDirection),
      newFlexDirection
    );

    const [resolvedJustifyName, resolvedJustifyValue] = resolveAlignment(
      ...reverseResolveAlignment('justifyContent', currentJustifyContent as AlignmentValue, currentFlexDirection),
      newFlexDirection
    );

    updates.display = 'flex';
    updates[resolvedAlignName] = resolvedAlignValue;
    updates[resolvedJustifyName] = resolvedJustifyValue;
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

  input {
    padding-left: 1.2rem;
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
    min-width: 1rem;
  }
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
    width: 2rem;
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
  justify-content: space-around;
  align-items: center;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white-3);
  padding: 0.6rem;
`;

const TextAlignContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white-3);
  padding: 1.2rem;
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
