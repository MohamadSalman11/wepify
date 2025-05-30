import styled from 'styled-components';

const StyledDivider = styled.span<{ rotate: number; width: number }>`
  width: ${(props) => props.width}px;
  height: 1px;
  background-color: var(--color-gray-dark-2);
  display: inline-block;
  transform: rotate(${(props) => props.rotate}deg);
`;

function Divider({ rotate = 0, width = 60 }: { rotate?: number; width?: number }) {
  return <StyledDivider rotate={rotate} width={width} />;
}

export default Divider;
