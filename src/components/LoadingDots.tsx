import styled, { keyframes } from 'styled-components';

/**
 * Types
 */

interface LoadingDotsProps {
  size?: number;
  color?: string;
  gap?: number;
  className?: string;
}

/**
 * Component definition
 */

export default function LoadingDots({
  size = 8,
  color = 'var(--color-primary)',
  gap = 4,
  className
}: LoadingDotsProps) {
  return (
    <DotsWrapper $gap={gap} className={className}>
      <Dot $size={size} $color={color} $delay={0} />
      <Dot $size={size} $color={color} $delay={0.2} />
      <Dot $size={size} $color={color} $delay={0.4} />
    </DotsWrapper>
  );
}

/**
 * Styles
 */

const bounce = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-2px);
    opacity: 0.8;
  }
  60% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
`;

const DotsWrapper = styled.div<{ $gap: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  gap: ${({ $gap }) => `${$gap}px`};
`;

const Dot = styled.div<{ $size: number; $color: string; $delay: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
  animation: ${bounce} 0.8s infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;
