import type { IconType } from 'react-icons';
import styled from 'styled-components';

/**
 * Constants
 */

const sizeMap: Record<IconSize, string> = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem'
};

const DEFAULT_ICON_SIZE = 'lg';

/**
 * Styles
 */

const IconWrapper = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-base);
  cursor: pointer;
  border-radius: var(--border-radius-full);
  padding: 0.6rem;

  &:hover {
    background-color: var(--color-white-2);
  }
`;

/**
 * Types
 */

type IconSize = 'sm' | 'md' | 'lg';

interface IconProps {
  icon: IconType;
  size?: IconSize;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * Component definition
 */

const Icon = ({ icon: IconComponent, size = DEFAULT_ICON_SIZE, onClick, hover, ...props }: IconProps) => {
  const iconElement = <IconComponent size={sizeMap[size]} onClick={onClick} {...props} />;

  if (!hover) return iconElement;

  return <IconWrapper onClick={onClick}>{iconElement}</IconWrapper>;
};

export default Icon;
