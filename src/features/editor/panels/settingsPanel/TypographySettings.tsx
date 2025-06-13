import styled from 'styled-components';
import { GridContainer, SubTitle, Title, type HandleStyleChanges } from '.';
import Select from '../../../../components/form/Select';
import { useAppSelector } from '../../../../store';
import ColorPicker from '../../ColorPicker';

/**
 * Constants
 */

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

const OPTIONS_FONT_WEIGHT = [
  'Thin',
  'ExtraLight',
  'Light',
  'Regular',
  'Medium',
  'SemiBold',
  'Bold',
  'ExtraBold',
  'Black'
];

const OPTIONS_FONT_SIZE = [10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128];

/**
 * Styles
 */

const TypographyContainer = styled.div`
  & > div {
    display: flex;
    row-gap: 3.2rem;
    flex-direction: column;
  }
`;

/**
 * Component definition
 */

function TypographySettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const selection = useAppSelector((state) => state.selection.selectedElement);

  return (
    <TypographyContainer>
      <Title>Typography</Title>
      <div>
        <div>
          <SubTitle>Font Family</SubTitle>
          <Select
            defaultSelect={selection.fontFamily}
            options={webSafeFonts}
            onChange={(option) => handleStyleChanges(option, 'fontFamily')}
          />
        </div>
        <GridContainer>
          <div>
            <SubTitle>Weight</SubTitle>
            <Select
              defaultSelect={selection.fontWeight}
              options={OPTIONS_FONT_WEIGHT}
              onChange={(option) => handleStyleChanges(option, 'fontWeight')}
            />
          </div>
          <div>
            <SubTitle>Font Size</SubTitle>
            <Select
              editable
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
      </div>
    </TypographyContainer>
  );
}

export default TypographySettings;
