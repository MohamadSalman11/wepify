import type { InputChangeEvent } from '@shared/types';
import Sketch from '@uiw/react-color-sketch';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Input from '../../components/form/Input';
import useOutsideClick from '../../hooks/useOutsideClick';

/**
 * Constants
 */

const DEFAULT_COLOR = '#ffffff';

/**
 * Types
 */

interface ColorPickerProps {
  name: string;
  defaultValue?: string;
  onChange?: (event: { target: { value: string | number; name: string } }) => void;
}

/**
 * Component definition
 */

export default function ColorPicker({ name, defaultValue, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hex, setHex] = useState(defaultValue || DEFAULT_COLOR);
  const colorPickerRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  useEffect(() => {
    setHex(defaultValue || DEFAULT_COLOR);
  }, [defaultValue]);

  function handleHexInputChange(event: InputChangeEvent) {
    const value = event.target.value.trim();
    const hex = value.startsWith('#') ? value : `#${value}`;
    setHex(hex);
    onChange?.({ target: { value: hex, name } });
  }

  function handleSketchColorChange(color: { hex: string }) {
    setHex(color.hex);
    onChange?.({ target: { value: color.hex, name } });
  }

  return (
    <div ref={colorPickerRef}>
      <Preview onClick={() => setIsOpen(!isOpen)}>
        <PreviewBox style={{ backgroundColor: hex }} />
        <PreviewInput name={name} type='text' value={hex} onChange={handleHexInputChange} />
      </Preview>
      {isOpen && <StyledSketch color={hex} onChange={handleSketchColorChange} />}
    </div>
  );
}

/**
 * Styles
 */

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
  background-color: var(--color-white);
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
