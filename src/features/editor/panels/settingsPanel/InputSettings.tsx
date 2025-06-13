import { GridContainer, SubTitle, Title, type HandleStyleChanges } from '.';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { useAppSelector } from '../../../../store';
import type { InputElement } from '../../../../types';

/**
 * Constants
 */

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
 * Component definition
 */

function InputSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const { type, placeholder } = useAppSelector((state) => state.selection.selectedElement) as InputElement;

  return (
    <div>
      <Title>Input</Title>
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
    </div>
  );
}

export default InputSettings;
