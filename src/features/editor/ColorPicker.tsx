import Sketch from '@uiw/react-color-sketch';
import { useState } from 'react';
import styled from 'styled-components';
import Input from '../../components/form/Input';
import useOutsideClick from '../../hooks/useOutsideClick';

const StyledSketch = styled(Sketch)`
  position: absolute;
  right: 35rem;
  bottom: 10rem;
  background-color: var(--color-black-light-2) !important;

  [class^='w-color-editable-input'] {
    color: var(--color-gray) !important;

    input {
      box-shadow: none !important;
      border: var(--border-base) !important;
      border-radius: var(--border-radius-xs) !important;
    }

    span {
      display: inline-block;
      margin: 0.4rem 0;
    }
  }

  .w-color-swatch {
    border-top: var(--border-base) !important;
  }
`;

const Preview = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PreviewBox = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #fff;
  border-radius: var(--border-radius-sm);
  position: absolute;
  left: 5%;
  cursor: pointer;
`;

const PreviewInput = styled(Input)`
  padding-left: 4.8rem;
  background-color: transparent;
  border: var(--border-base);
`;

function ColorPicker({
  propName,
  onChangeHandler
}: {
  propName: string;
  onChangeHandler: (name: string, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hex, setHex] = useState('#fff');
  const divRef = useOutsideClick(() => setIsOpen(false));

  return (
    <div ref={divRef}>
      <Preview onClick={() => setIsOpen(!isOpen)}>
        <PreviewBox style={{ backgroundColor: hex }} />
        <PreviewInput
          name={propName}
          type='text'
          value={hex}
          onChange={(e) => {
            const value = e.target.value.trim();
            const hex = value.startsWith('#') ? value : `#${value}`;
            setHex(hex);
            onChangeHandler(propName, hex);
          }}
        />
      </Preview>

      {isOpen && (
        <StyledSketch
          color={hex}
          onChange={(color) => {
            setHex(color.hex);
            onChangeHandler(propName, color.hex);
          }}
        />
      )}
    </div>
  );
}

export default ColorPicker;
