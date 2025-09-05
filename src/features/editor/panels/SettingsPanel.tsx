import { resolveAlignment, reverseResolveAlignment } from '@compiler/utils/resolveAlignment';
import { EditorToIframe, ElementsName } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import type { PageElement, PageElementAttrs, PageElementStyle } from '@shared/typing';
import { cloneElement, createContext, useContext, type ReactElement } from 'react';
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
import CollapsibleSection from '../CollapsibleSection';
import ColorPicker from '../ColorPicker';
import { selectCurrentElement, selectCurrentPage, selectCurrentPageElements } from '../editorSlice';
import { Settings, useSettingsVisibility } from '../hooks/useSettingsVisibility';
import { useStyle } from '../hooks/useStyle';

/**
 * Constants
 */

const DEFAULT_BORDER_RADIUS = 0;
const DEFAULT_BORDER_COLOR = '#4a90e2';
const DEFAULT_BORDER_WIDTH = 2;
const REGEX_TRAILING_NUMBER_SPLIT = /-(\d+)$/;

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
  'Rubik',
  'Savate',
  'Source Code Pro',
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

interface SettingsContextProps {
  handleElementChange: HandleElementChange;
}

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
      <StrokeSettings />
      <PageSettings />
    </SettingsContext.Provider>
  );
}

function PropertyEditor({
  children,
  styleName,
  attrName
}: {
  children: ReactElement<typeof Input | typeof Select>;
  styleName?: StyleProp;
  attrName?: keyof NonNullable<PageElementAttrs>;
}) {
  const { handleElementChange } = useSettingsContext();

  return cloneElement(children, {
    onChange: (event: any) => {
      if (styleName) {
        handleElementChange({ style: { [styleName]: event.target.value } });
      }

      if (attrName) {
        handleElementChange({ attrs: { [attrName]: event.target.value } });
      }
    }
  });
}

function SelectorSettings() {
  const selectedElement = useAppSelector(selectCurrentElement);
  const elements = useAppSelector(selectCurrentPageElements);

  const sortedElementIds = elements
    .map((el) => el.id)
    .sort((a, b) => {
      const [aBase, aNum] = a.split(REGEX_TRAILING_NUMBER_SPLIT);
      const [bBase, bNum] = b.split(REGEX_TRAILING_NUMBER_SPLIT);

      if (aBase !== bBase) return aBase.localeCompare(bBase);
      return Number(aNum) - Number(bNum);
    });

  return (
    <div>
      <CollapsibleSection title='Selector' open>
        <SelectorContainer>
          <Icon icon={LuMonitor} />
          <Select
            name='selector'
            options={sortedElementIds}
            defaultSelect={selectedElement.id}
            onChange={(event) => iframeConnection.send(EditorToIframe.SelectElement, event.target.value)}
          />
        </SelectorContainer>
      </CollapsibleSection>
    </div>
  );
}

function SizeSettings() {
  const style = useStyle();
  const { handleElementChange } = useSettingsContext();
  const { name } = useAppSelector(selectCurrentElement);
  const disableInput = [ElementsName.Item, ElementsName.Section].includes(name);

  const handleRotate = () => {
    const current = style.rotate ?? 0;
    let newRotate = current - 90;
    if (newRotate <= -180) newRotate = 180;
    handleElementChange('rotate', newRotate);
  };

  const handleFlipHorizontal = () => {
    const currentScaleX = style.scaleX ?? 1;
    const newScaleX = currentScaleX === 1 ? -1 : 1;
    handleElementChange('scaleX', newScaleX);
  };

  const handleFlipVertical = () => {
    const currentScaleY = style.scaleY ?? 1;
    const newScaleY = currentScaleY === 1 ? -1 : 1;
    handleElementChange('scaleY', newScaleY);
  };

  return (
    <div>
      <CollapsibleSection title='Size' open>
        <GridContainer>
          <SizeRow $disabled={disableInput}>
            <label htmlFor='settings-panel-input-left'>X</label>
            <PropertyEditor styleName='left'>
              <Input id='settings-panel-input-left' disabled={disableInput} type='number' value={style.left ?? 0} />
            </PropertyEditor>
          </SizeRow>
          <SizeRow $disabled={disableInput}>
            <label htmlFor='settings-panel-input-top'>Y</label>
            <PropertyEditor styleName='top'>
              <Input id='settings-panel-input-top' disabled={disableInput} type='number' value={style.top ?? 0} />
            </PropertyEditor>
          </SizeRow>
          <SizeRow $disabled={disableInput}>
            <label htmlFor='settings-panel-input-width'>W</label>
            <PropertyEditor styleName='width'>
              <Select
                id='settings-panel-input-width'
                editable
                editInputType='text'
                options={OPTIONS_SIZE}
                disabled={disableInput}
                defaultSelect={style.width}
              />
            </PropertyEditor>
          </SizeRow>
          <SizeRow>
            <label htmlFor='settings-panel-input-height'>H</label>
            <PropertyEditor styleName='height'>
              <Select
                id='settings-panel-input-height'
                editable
                editInputType='text'
                options={['screen', ...OPTIONS_SIZE]}
                defaultSelect={style.height}
              />
            </PropertyEditor>
          </SizeRow>
          <SizeRow $disabled={disableInput}>
            <label htmlFor='settings-panel-input-rotate'>R</label>
            <PropertyEditor styleName='rotate'>
              <Input id='settings-panel-input-rotate' type='number' disabled={disableInput} value={style.rotate ?? 0} />
            </PropertyEditor>
          </SizeRow>
          <RotationContainer>
            <AppTooltip label='Rotate -90°' side='top' sideOffset={5} sizeSmall>
              <Icon icon={LuRotateCwSquare} disabled={disableInput} onClick={handleRotate} />
            </AppTooltip>
            <AppTooltip label='Flip Horizontal' side='top' sideOffset={5} sizeSmall>
              <Icon icon={LuFlipHorizontal2} disabled={disableInput} onClick={handleFlipHorizontal} />
            </AppTooltip>
            <AppTooltip label='Flip Vertical' side='top' sideOffset={5} sizeSmall>
              <Icon icon={LuFlipVertical2} disabled={disableInput} onClick={handleFlipVertical} />
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
  const justifyContent = style.justifyContent || 'flex-start';
  const alignItems = style.alignItems || 'flex-start';
  const flexDirection = style.flexDirection || 'column';

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
  const { justifyContent, columnGap, rowGap, flexDirection } = style;
  const jcValue = justifyContent?.replace(/^space-/, '') || '';
  const space = OPTIONS_SPACE_VALUE.has(jcValue) ? jcValue : 'none';

  const handleSelect = (value: FlexDirectionOption) => {
    handleElementChange({ style: { flexDirection: value } });
  };

  return (
    <div>
      <CollapsibleSection title='Flex'>
        <GridContainer>
          <div>
            <SubTitle>Gap X</SubTitle>
            <PropertyEditor styleName='columnGap'>
              <Select editable defaultSelect={columnGap || 0} options={OPTIONS_COLUMN_GAP} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Gap Y</SubTitle>
            <PropertyEditor styleName='rowGap'>
              <Select editable defaultSelect={rowGap || 0} options={OPTIONS_ROW_GAP} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Space</SubTitle>
            <PropertyEditor styleName='justifyContent'>
              <Select defaultSelect={space} options={OPTIONS_SPACE} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Direction</SubTitle>
            <DisplayOptionsWrapper>
              {OPTIONS_FLEX_DIRECTION.map(({ value, icon }) => (
                <AppTooltip key={value} label={value} side='top' sideOffset={5} sizeSmall>
                  <DisplayOptionButton
                    $active={(flexDirection || 'column') === value}
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
  const { marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft } =
    useStyle();

  return (
    <div>
      <CollapsibleSection title='Spacing'>
        <SpaceBox>
          <div>
            <PropertyEditor styleName='marginTop'>
              <input type='number' value={marginTop ?? 0} />
            </PropertyEditor>
          </div>
          <PaddingBox>
            <div>
              <PropertyEditor styleName='paddingTop'>
                <input type='number' value={paddingTop ?? 0} />
              </PropertyEditor>
            </div>
            <div>&nbsp;</div>
            <div>
              <PropertyEditor styleName='paddingLeft'>
                <input type='number' value={paddingLeft ?? 0} />
              </PropertyEditor>
            </div>
            <div>
              <PropertyEditor styleName='paddingRight'>
                <input type='number' value={paddingRight ?? 0} />
              </PropertyEditor>
            </div>
            <div>
              <PropertyEditor styleName='paddingBottom'>
                <input type='number' value={paddingBottom ?? 0} />
              </PropertyEditor>
            </div>
          </PaddingBox>
          <div>
            <PropertyEditor styleName='marginLeft'>
              <input type='number' value={marginLeft ?? 0} />
            </PropertyEditor>
          </div>
          <div>
            <PropertyEditor styleName='marginRight'>
              <input type='number' value={marginRight ?? 0} />
            </PropertyEditor>
          </div>
          <div>
            <PropertyEditor styleName='marginBottom'>
              <input type='number' value={marginBottom ?? 0} />
            </PropertyEditor>
          </div>
        </SpaceBox>
      </CollapsibleSection>
    </div>
  );
}

function GridSettings() {
  const { columns, rows, columnWidth, rowHeight, columnGap, rowGap } = useStyle();

  return (
    <div>
      <CollapsibleSection title='Grid' open>
        <GridContainer>
          <div>
            <SubTitle>Columns</SubTitle>
            <PropertyEditor styleName='columns'>
              <Select editable defaultSelect={columns} options={OPTIONS_COLUMN} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Rows</SubTitle>
            <PropertyEditor styleName='rows'>
              <Select editable defaultSelect={rows} options={OPTIONS_ROW} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Width</SubTitle>
            <PropertyEditor styleName='columnWidth'>
              <Select editable editInputType='text' defaultSelect={columnWidth} options={OPTIONS_COLUMN_WIDTH} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Height</SubTitle>
            <PropertyEditor styleName='rowHeight'>
              <Select editable editInputType='text' defaultSelect={rowHeight} options={OPTIONS_ROW_HEIGHT} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Gap X</SubTitle>
            <PropertyEditor styleName='columnGap'>
              <Select editable editInputType='text' defaultSelect={columnGap} options={OPTIONS_COLUMN_GAP} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Gap Y</SubTitle>
            <PropertyEditor styleName='rowGap'>
              <Select editable editInputType='text' defaultSelect={rowGap} options={OPTIONS_ROW_GAP} />
            </PropertyEditor>
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function LinkSettings() {
  const href = useAppSelector(selectCurrentElement).attrs?.href;

  return (
    <div>
      <CollapsibleSection title='Link' open>
        <div>
          <PropertyEditor attrName='href'>
            <Input type='text' value={href || ''} placeholder='https://example.com' />
          </PropertyEditor>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function InputSettings() {
  const attrs = useAppSelector(selectCurrentElement).attrs;

  return (
    <div>
      <CollapsibleSection title='Input' open>
        <GridContainer>
          <div>
            <SubTitle>Placeholder</SubTitle>
            <PropertyEditor attrName='placeholder'>
              <Input type='text' defaultValue={attrs?.placeholder || ''} placeholder='E-Mail' />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Type</SubTitle>
            <PropertyEditor attrName='type'>
              <Select editInputType='text' defaultSelect={attrs?.type || ''} options={OPTIONS_INPUT_TYPE} />
            </PropertyEditor>
          </div>
        </GridContainer>
      </CollapsibleSection>
    </div>
  );
}

function TypographySettings() {
  const name = useAppSelector(selectCurrentElement).name;
  const { handleElementChange } = useSettingsContext();
  const { textAlign, fontFamily, fontWeight, fontSize, color } = useStyle();
  const showTextAlign = [ElementsName.Heading, ElementsName.Text, ElementsName.Link, ElementsName.Input].includes(name);

  return (
    <TypographyContainer>
      <CollapsibleSection title='Typography'>
        <div>
          <SubTitle>Font Family</SubTitle>
          <PropertyEditor styleName='fontFamily'>
            <Select defaultSelect={fontFamily ?? ''} options={OPTIONS_FONT} />
          </PropertyEditor>
        </div>
        <GridContainer>
          <div>
            <SubTitle>Weight</SubTitle>
            <PropertyEditor styleName='fontWeight'>
              <Select defaultSelect={fontWeight ?? ''} options={Object.keys(FONT_WEIGHT_VALUES)} />
            </PropertyEditor>
          </div>
          <div>
            <SubTitle>Font Size</SubTitle>
            <PropertyEditor styleName='fontSize'>
              <Select editable editInputType='text' defaultSelect={fontSize ?? ''} options={OPTIONS_FONT_SIZE} />
            </PropertyEditor>
          </div>
        </GridContainer>
        <div>
          <SubTitle>Color</SubTitle>
          <PropertyEditor styleName='color'>
            <ColorPicker defaultValue={color ?? ''} />
          </PropertyEditor>
        </div>
        {showTextAlign && (
          <div>
            <SubTitle>Text Align</SubTitle>
            <TextAlignContainer>
              {OPTIONS_TEXT_ALIGN.map(({ value, icon }) => (
                <AppTooltip key={value} label={value} side='top' sideOffset={5} sizeSmall>
                  <Icon
                    icon={icon}
                    isSelected={(textAlign || 'left') === value}
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
  const style = useStyle();

  return (
    <div>
      <CollapsibleSection title='Fill'>
        <div>
          <SubTitle>Background Color</SubTitle>
          <PropertyEditor styleName='backgroundColor'>
            <ColorPicker defaultValue={style.backgroundColor} />
          </PropertyEditor>
        </div>
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
    borderRadius = DEFAULT_BORDER_RADIUS,
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
          <div>
            <PropertyEditor styleName='borderColor'>
              <ColorPicker defaultValue={borderColor} />
            </PropertyEditor>
          </div>
          <StrokeWidthContainer>
            <StrokeLabel>width</StrokeLabel>
            <PropertyEditor styleName='borderWidth'>
              <Input type='number' defaultValue={borderWidth} />
            </PropertyEditor>
          </StrokeWidthContainer>
          <StrokeWidthContainer>
            <StrokeLabel>radius</StrokeLabel>
            <PropertyEditor styleName='borderRadius'>
              <Input type='number' defaultValue={borderRadius} />
            </PropertyEditor>
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
        <SubTitle>Background Color</SubTitle>
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

const SizeRow = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 1.6rem;
  color: var(--color-gray);

  label {
    min-width: 1rem;
    ${(props) => props.$disabled && 'color: var(--color-gray-light-3);'}
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
