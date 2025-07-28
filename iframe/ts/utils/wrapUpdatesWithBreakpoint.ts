import { getScreenBreakpoint } from './getScreenBreakpoint';

export const wrapUpdatesWithBreakpoint = (updates: Record<string, any>) => {
  const breakpoint = getScreenBreakpoint();
  const wrapped = {};

  for (const key in updates) {
    const k = key as keyof typeof updates;

    (wrapped as any)[k] = { [breakpoint]: updates[k] };
  }

  return wrapped;
};
