import styled from 'styled-components';

/**
 * Constants
 */

const DEFAULT_ROTATE = 0;
const DEFAULT_DIVIDER_WIDTH = 60;
const DEFAULT_COLOR = 'var(--color-white-3)';

/**
 * Component definition
 */

export default function Divider({
  rotate = DEFAULT_ROTATE,
  width = DEFAULT_DIVIDER_WIDTH,
  color = DEFAULT_COLOR
}: {
  rotate?: number;
  width?: number;
  color?: string;
}) {
  return <StyledDivider $rotate={rotate} $width={width} $color={color} />;
}

/**
 * Styles
 */

const StyledDivider = styled.span<{ $rotate: number; $width: number; $color: string }>`
  width: ${(props) => props.$width}px;
  height: 1px;
  background-color: ${(props) => props.$color};
  display: inline-block;
  transform: rotate(${(props) => props.$rotate}deg);
`;
