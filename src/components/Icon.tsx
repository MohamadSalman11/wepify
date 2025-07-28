import * as Tooltip from '@radix-ui/react-tooltip';
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
  hover?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  tooltipLabel?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipSideOffset?: number;
  borderRadius?: BorderRadius;
  onClick?: () => void;
}

/**
 * Component definition
 */

export default function Icon({
  icon: IconComponent,
  size = DEFAULT_ICON_SIZE,
  hover,
  isActive = false,
  disabled = false,
  tooltipLabel,
  tooltipSide = 'bottom',
  tooltipSideOffset = 15,
  borderRadius = DEFAULT_BORDER_RADIUS,
  onClick,
  ...props
}: IconProps) {
  const iconElement = (
    <IconComponent
      style={{ color: disabled ? 'var(--color-gray-light-2)' : 'var(--color-gray)' }}
      size={SIZE[size]}
      onClick={disabled ? undefined : onClick}
      {...props}
    />
  );

  const wrappedIcon = hover ? (
    <IconWrapper $borderRadius={borderRadius} $isActive={isActive} $disabled={disabled} onClick={onClick}>
      {iconElement}
    </IconWrapper>
  ) : (
    iconElement
  );

  if (!tooltipLabel) return wrappedIcon;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{wrappedIcon}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className='TooltipContent' side={tooltipSide} sideOffset={tooltipSideOffset}>
          {tooltipLabel}
          <Tooltip.Arrow className='TooltipArrow' />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/**
 * Styles
 */

const IconWrapper = styled.span<{
  $borderRadius: BorderRadius;
  $isActive?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-base);
  cursor: pointer;
  border-radius: ${({ $borderRadius }) => `var(--border-radius-${$borderRadius})`};
  padding: 0.6rem;
  width: fit-content;
  background-color: ${({ $isActive }) => ($isActive ? 'var(--color-white-2)' : 'transparent')};

  &:hover {
    background-color: var(--color-white-2);
  }
`;
