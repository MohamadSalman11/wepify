import type { IconType } from 'react-icons';

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
 * Types
 */

type IconSize = 'sm' | 'md' | 'lg';

interface IconProps {
  icon: IconType;
  size?: IconSize;
  onClick?: () => void;
}

/**
 * Component definition
 */

const Icon = ({ icon: IconComponent, size = DEFAULT_ICON_SIZE, onClick, ...props }: IconProps) => {
  return <IconComponent size={sizeMap[size]} onClick={onClick} {...props} />;
};

export default Icon;
