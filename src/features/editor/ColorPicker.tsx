import { colorToHex } from '@shared/utils';
import Sketch from '@uiw/react-color-sketch';
import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Input from '../../components/form/Input';
import useOutsideClick from '../../hooks/useOutsideClick';

/**
 * Constants
 */

const DEFAULT_COLOR = '#ffffff';

const PRESET_COLORS = [
  '#D0021B',
  '#F5A623',
  '#f8e61b',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
  '#343c44'
];

/**
 * Types
 */

interface ColorPickerProps {
  defaultValue?: string;
  onChange?: (event: { target: { value: string | number } }) => void;
}

/**
 * Component definition
 */

export default function ColorPicker({ defaultValue, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hex, setHex] = useState(defaultValue || DEFAULT_COLOR);
  const colorPickerRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  useEffect(() => {
    setHex(defaultValue || DEFAULT_COLOR);
  }, [defaultValue]);

  const handleHexInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    const hex = value.startsWith('#') ? value : `#${value}`;
    setHex(hex);
    onChange?.({ target: { value: hex } });
  };

  const handleSketchColorChange = (color: Record<string, any>) => {
    let cssColor: string;

    if (color.rgba) {
      const { r, g, b, a } = color.rgba;
      cssColor = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    } else if (color.rgb) {
      const { r, g, b } = color.rgb;
      cssColor = `rgb(${r}, ${g}, ${b})`;
    } else if (typeof color === 'string') {
      cssColor = color;
    } else {
      return;
    }

    const hex = colorToHex(cssColor);

    setHex(hex);
    onChange?.({ target: { value: hex } });
  };
  return (
    <div ref={colorPickerRef}>
      <Preview onClick={() => setIsOpen(!isOpen)}>
        <PreviewBox style={{ backgroundColor: hex }} />
        <PreviewInput type='text' value={hex} onChange={handleHexInputChange} />
      </Preview>
      {isOpen && <StyledSketch presetColors={PRESET_COLORS} color={hex} onChange={handleSketchColorChange} />}
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
  box-shadow: 0 0 2px rgba(var(--color-black-light-rgb), 0.3);
  position: absolute;
  left: 5%;
  cursor: pointer;
`;

const PreviewInput = styled(Input)`
  padding-left: 4.2rem;
  padding-right: 0.8rem;
  background-color: transparent;
  border: var(--border-base);
`;
