import type { IconType } from 'react-icons';
import styled from 'styled-components';

/**
 * Constants
 */

const SIZE: Record<IconSize, string> = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem'
};

const DEFAULT_ICON_SIZE = 'lg';
const DEFAULT_BORDER_RADIUS = 'full';

/**
 * Types
 */

type IconSize = 'sm' | 'md' | 'lg';
type BorderRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';

interface IconProps {
  icon: IconType;
  size?: IconSize;
  onClick?: () => void;
  hover?: boolean;
  borderRadius?: BorderRadius;
}

/**
 * Component definition
 */

export default function Icon({
  icon: IconComponent,
  size = DEFAULT_ICON_SIZE,
  onClick,
  hover,
  borderRadius = DEFAULT_BORDER_RADIUS,
  ...props
}: IconProps) {
  const iconElement = <IconComponent size={SIZE[size]} onClick={onClick} {...props} />;

  if (!hover) return iconElement;

  return (
    <IconWrapper $borderRadius={borderRadius} onClick={onClick}>
      {iconElement}
    </IconWrapper>
  );
}

/**
 * Styles
 */

const IconWrapper = styled.span<{ $borderRadius: BorderRadius }>`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-base);
  cursor: pointer;
  border-radius: ${({ $borderRadius }) => `var(--border-radius-${$borderRadius})`};
  padding: 0.6rem;

  &:hover {
    background-color: var(--color-white-2);
  }
`;
