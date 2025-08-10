import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';

/**
 * Constants
 */

const DEFAULT_TOOLTIP_SIDE = 'bottom';
const DEFAULT_TOOLTIP_OFFSET = 15;

/**
 * Types
 */

interface AppTooltipProps {
  label: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  sizeSmall?: boolean;
  children: React.ReactNode;
}

/**
 * Component definition
 */

export default function AppTooltip({
  label,
  side = DEFAULT_TOOLTIP_SIDE,
  sideOffset = DEFAULT_TOOLTIP_OFFSET,
  sizeSmall = false,
  children
}: AppTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className={clsx('TooltipContent', sizeSmall && 'TooltipSmall')}
          side={side}
          sideOffset={sideOffset}
        >
          {label}
          <Tooltip.Arrow className='TooltipArrow' />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
