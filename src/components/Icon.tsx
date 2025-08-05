import * as Tooltip from '@radix-ui/react-tooltip';
import { forwardRef, Ref } from 'react';
import type { IconType } from 'react-icons';
import styled from 'styled-components';

/**
 * Constants
 */

const DEFAULT_ICON_SIZE = 'lg';
const DEFAULT_BORDER_RADIUS = 'full';
const DEFAULT_TOOLTIP_SIDE = 'bottom';

const SIZE: Record<IconSize, string> = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem'
};

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
  isSelected?: boolean;
  disabled?: boolean;
  color?: string;
  hoverColor?: string;
  fill?: boolean;
  tooltipLabel?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipSideOffset?: number;
  borderRadius?: BorderRadius;
  onClick?: () => void;
  className?: string;
}

/**
 * Component definition
 */

const Icon = forwardRef<HTMLButtonElement | SVGElement, IconProps>(
  (
    {
      icon: IconComponent,
      size = DEFAULT_ICON_SIZE,
      hover,
      isActive = false,
      isSelected = false,
      disabled = false,
      color,
      hoverColor = 'var(--color-white-2)',
      fill = false,
      tooltipLabel,
      tooltipSide = DEFAULT_TOOLTIP_SIDE,
      tooltipSideOffset = 15,
      borderRadius = DEFAULT_BORDER_RADIUS,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const computedColor = disabled
      ? 'var(--color-gray-light-2)'
      : isSelected
        ? 'var(--color-primary)'
        : color || 'var(--color-gray)';

    const cursorStyle = disabled ? 'not-allowed' : onClick ? 'pointer' : '';

    const iconElement = (
      <IconComponent
        color={computedColor}
        cursor={cursorStyle}
        fill={fill ? 'currentcolor' : 'none'}
        size={SIZE[size]}
        onClick={disabled ? undefined : onClick}
        {...props}
      />
    );

    const wrappedIcon = hover ? (
      <Button
        ref={ref as Ref<HTMLButtonElement>}
        className={className}
        $borderRadius={borderRadius}
        $isActive={isActive}
        $disabled={disabled}
        $hoverColor={hoverColor}
        onClick={onClick}
      >
        {iconElement}
      </Button>
    ) : (
      <Span className={className} ref={ref as Ref<HTMLSpanElement>}>
        {iconElement}
      </Span>
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
);

export default Icon;

/**
 * Styles
 */

const Button = styled.button<{
  $borderRadius: BorderRadius;
  $isActive?: boolean;
  $disabled?: boolean;
  $hoverColor: string;
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
    background-color: ${(props) => props.$hoverColor};
  }
`;

const Span = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
