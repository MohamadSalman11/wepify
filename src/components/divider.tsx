import styled from 'styled-components';

/**
 * Constants
 */

const DEFAULT_ROTATE = 0;
const DEFAULT_DIVIDER_WIDTH = 60;

/**
 * Styles
 */

const StyledDivider = styled.span<{ rotate: number; width: number }>`
  width: ${(props) => props.width}px;
  height: 1px;
  background-color: var(--color-gray-dark-2);
  display: inline-block;
  transform: rotate(${(props) => props.rotate}deg);
`;

/**
 * Component definition
 */

function Divider({ rotate = DEFAULT_ROTATE, width = DEFAULT_DIVIDER_WIDTH }: { rotate?: number; width?: number }) {
  return <StyledDivider rotate={rotate} width={width} />;
}

export default Divider;
