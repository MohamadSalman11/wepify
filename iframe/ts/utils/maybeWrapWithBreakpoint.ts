import { RESPONSIVE_PROPS } from '@shared/constants';
import { getScreenBreakpoint } from './getScreenBreakpoint';

export const maybeWrapWithBreakpoint = (updates: Record<string, any>) => {
  const breakpoint = getScreenBreakpoint();
  const wrapped: Record<string, any> = {};

  for (const key in updates) {
    wrapped[key] = RESPONSIVE_PROPS.has(key) ? { [breakpoint]: updates[key] } : updates[key];
  }

  return wrapped;
};
