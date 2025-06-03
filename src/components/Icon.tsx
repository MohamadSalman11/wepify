import type { IconType } from 'react-icons';

type IconSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<IconSize, string> = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem'
};

const Icon = ({
  icon: IconComponent,
  size = 'lg',
  onClick
}: {
  icon: IconType;
  size?: IconSize;
  onClick?: () => void;
}) => {
  return <IconComponent size={sizeMap[size]} onClick={onClick} />;
};

export default Icon;
