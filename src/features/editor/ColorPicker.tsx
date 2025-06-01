import Sketch from '@uiw/react-color-sketch';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledSketch = styled(Sketch)`
  position: absolute;
  transform: translate(-115%, -50%);
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

const Input = styled.input`
  background-color: var(--color-black-light-2);
  padding: 0.8rem 0.8rem 0.8rem 4.8rem;
  border: var(--border-base);
  border-radius: var(--border-radius-sm);
  color: var(--color-white);
  width: 100%;
`;

function ColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [hex, setHex] = useState('#fff');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref}>
      <Preview onClick={() => setIsOpen(!isOpen)}>
        <PreviewBox style={{ backgroundColor: hex }} />
        <Input type='text' value={hex} readOnly />
      </Preview>

      {isOpen && (
        <StyledSketch
          color={hex}
          onChange={(color) => {
            setHex(color.hex);
          }}
        />
      )}
    </div>
  );
}

export default ColorPicker;
