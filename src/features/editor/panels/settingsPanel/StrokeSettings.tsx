import { useState } from 'react';
import { LuPanelBottom, LuPanelLeft, LuPanelRight, LuPanelTop } from 'react-icons/lu';
import styled from 'styled-components';
import { GridContainer, Title, type HandleStyleChanges } from '.';
import Input from '../../../../components/form/Input';
import Icon from '../../../../components/Icon';
import { useAppSelector } from '../../../../store';
import ColorPicker from '../../ColorPicker';

/**
 * Constants
 */

const DEFAULT_BORDER_COLOR = '#4a90e2';
const DEFAULT_BORDER_WIDTH = 2;

const BORDER_SIDES = [
  { side: 'top', label: 'Top', icon: LuPanelTop },
  { side: 'right', label: 'Right', icon: LuPanelRight },
  { side: 'bottom', label: 'Bottom', icon: LuPanelBottom },
  { side: 'left', label: 'Left', icon: LuPanelLeft }
] as const;

/**
 * Styles
 */

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
  color: ${({ active }) => (active ? 'var(--color-gray-dark)' : 'var(--color-gray)')};

  &:hover {
    color: var(--color-gray-dark);
  }
`;

/**
 * Types
 */

type BorderSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Component definition
 */

function StrokeSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const { borderTop, borderRight, borderBottom, borderLeft, borderColor, borderWidth } = useAppSelector(
    (state) => state.selection.selectedElement
  );

  const [border, setBorder] = useState<Record<BorderSide, boolean>>({
    top: !!borderTop && borderTop !== 'none',
    right: !!borderRight && borderRight !== 'none',
    bottom: !!borderBottom && borderBottom !== 'none',
    left: !!borderLeft && borderLeft !== 'none'
  });

  const toggleBorder = (side: BorderSide) => {
    setBorder((prev) => {
      const isActive = !prev[side];
      const prop = `border${side[0].toUpperCase()}${side.slice(1)}`;
      const value = isActive
        ? `${borderWidth || DEFAULT_BORDER_WIDTH}px solid ${borderColor || DEFAULT_BORDER_COLOR}`
        : 'none';

      handleStyleChanges(value, prop);
      return { ...prev, [side]: isActive };
    });
  };

  return (
    <StrokeContainer>
      <Title>Stroke</Title>
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
            <BorderButton key={side} active={border[side]} onClick={() => toggleBorder(side)}>
              <span>{label}</span>
              <Icon icon={icon} size='sm' />
            </BorderButton>
          ))}
        </StrokePosition>
      </GridContainer>
    </StrokeContainer>
  );
}

export default StrokeSettings;
